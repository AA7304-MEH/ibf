import { Request, Response } from 'express';
import User from '../models/User';
import Startup from '../models/Startup';
import { AuthRequest } from '../middleware/auth';
import { socketService } from '../services/socketService';

export const getAdminStudents = async (req: Request, res: Response) => {
    try {
        const students = await User.find({
            role: { $in: ['teen', 'student'] }
        }).select('firstName lastName schoolDetails dateOfBirth consentStatus _id');

        const formattedStudents = students.map(s => {
            const birthDate = s.dateOfBirth ? new Date(s.dateOfBirth) : null;
            const age = birthDate ? new Date().getFullYear() - birthDate.getFullYear() : 'N/A';
            
            return {
                _id: s._id,
                userId: s._id,
                fullName: `${s.firstName || ''} ${s.lastName || ''}`.trim() || 'Anonymous Student',
                school: s.schoolDetails?.name || 'Not Specified',
                age: age,
                parentalConsentVerified: s.consentStatus === 'verified'
            };
        });

        res.json(formattedStudents);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching students', error: error.message });
    }
};

export const getIncubatorApps = async (req: Request, res: Response) => {
    try {
        const apps = await Startup.find().populate('founderId', 'firstName lastName');

        const formattedApps = apps.map(app => ({
            _id: app._id,
            userId: app.founderId?._id,
            startupName: app.name,
            fullName: (app.founderId as any) ? `${(app.founderId as any).firstName || ''} ${(app.founderId as any).lastName || ''}`.trim() : 'Unknown Founder',
            startupStage: app.stage,
            incubatorStatus: app.incubatorStatus || 'applied'
        }));

        res.json(formattedApps);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching incubator apps', error: error.message });
    }
};

export const updateStudentConsent = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const { verified } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.consentStatus = verified ? 'verified' : 'pending';
        await user.save();

        res.json({ message: 'Consent status updated', consentStatus: user.consentStatus });
    } catch (error: any) {
        res.status(500).json({ message: 'Error updating consent', error: error.message });
    }
};

// ==========================================
// MARKETPLACE ADMIN ENDPOINTS
// ==========================================

export const getPendingKYC = async (req: AuthRequest, res: Response) => {
    try {
        const users = await User.find({ kycStatus: 'pending' })
            .select('firstName lastName email kycStatus kycData createdAt')
            .sort({ createdAt: 1 });
        return res.json(users);
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};

export const approveKYC = async (req: AuthRequest, res: Response) => {
    try {
        const { userId } = req.params;
        const { status, notes } = req.body; // 'verified' or 'rejected'

        if (!['verified', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.kycStatus = status;
        
        // If rejected, clear the data so they can resubmit
        if (status === 'rejected') {
            user.kycData = undefined;
        }

        await user.save();

        // Notify User
        socketService.notifyUser(userId.toString(), 'kyc_update', {
            status,
            message: status === 'verified' 
                ? 'Your KYC has been approved. You can now request withdrawals.' 
                : `Your KYC was rejected. Reason: ${notes || 'Invalid documents'}. Please resubmit.`
        });

        return res.json({ message: `KYC marked as ${status}`, user });
    } catch (error) {
        console.error('approveKYC error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};
