import { Response } from 'express';
import User from '../models/User';
import Internship from '../models/Internship';
import { AuthRequest } from '../middleware/auth';

// Get all children linked to this parent
export const getChildren = async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.user.id);
        const parentEmail = user?.email;

        if (!parentEmail) return res.status(400).json({ message: 'Parent email not found' });

        // Find students who listed this parent's email
        // OR find students where parentInfo.accountId matches req.user.id
        const children = await User.find({
            $or: [
                { 'parentInfo.email': parentEmail },
                { 'parentInfo.accountId': req.user.id }
            ],
            role: 'student'
        }).select('-password'); // Exclude password

        res.json(children);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching children', error: error.message });
    }
};

// Get pending internship approvals for these children
export const getPendingApprovals = async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.user.id);
        const parentEmail = user?.email;

        // 1. Find children IDs
        const children = await User.find({
            $or: [
                { 'parentInfo.email': parentEmail },
                { 'parentInfo.accountId': req.user.id }
            ]
        }).select('_id');

        const childIds = children.map(c => c._id);

        // 2. Find Internships where status is 'pending_parent' and teenId is one of the children
        const pendingInternships = await Internship.find({
            teenId: { $in: childIds },
            status: 'pending_parent'
        }).populate('companyId', 'firstName lastName companyName')
            .populate('teenId', 'firstName lastName')
            .lean();

        // 3. Format the specific applications
        const approvals = pendingInternships.map(internship => ({
            internshipId: internship._id,
            internshipTitle: internship.title,
            companyName: (internship.companyId as any)?.companyName || (internship.companyId as any)?.firstName,
            studentId: internship.teenId?._id,
            studentName: (internship.teenId as any)?.firstName,
            createdAt: internship.createdAt
        }));

        res.json(approvals);

    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching approvals', error: error.message });
    }
};

// Approve or Reject an application
export const processApproval = async (req: AuthRequest, res: Response) => {
    try {
        const { internshipId, studentId, decision } = req.body; // decision: 'approved' | 'rejected'

        if (!['approved', 'rejected'].includes(decision)) {
            return res.status(400).json({ message: 'Invalid decision' });
        }

        const internship = await Internship.findById(internshipId);
        if (!internship) return res.status(404).json({ message: 'Internship not found' });

        // Verify it belongs to one of the parent's children
        const user = await User.findById(req.user.id);
        const children = await User.find({
            $or: [
                { 'parentInfo.email': user?.email },
                { 'parentInfo.accountId': req.user.id }
            ]
        }).select('_id');
        const childIds = children.map(c => c._id.toString());

        if (!studentId || !childIds.includes(studentId.toString())) {
            return res.status(403).json({ message: 'Unauthorized: Student is not linked to this parent' });
        }

        // Update status
        if (decision === 'approved') {
            internship.status = 'in_progress'; // Or whatever the next step is
            internship.parentApproval = {
                required: true,
                approvedAt: new Date(),
                parentId: req.user.id
            };
        } else {
            internship.status = 'cancelled';
        }

        await internship.save();

        res.json({ message: `Application ${decision}`, status: internship.status });

    } catch (error: any) {
        res.status(500).json({ message: 'Error processing approval', error: error.message });
    }
};
