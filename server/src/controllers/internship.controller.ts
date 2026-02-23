import { Request, Response } from 'express';
import Internship from '../models/Internship';
import User from '../models/User';
import SkillSwapProject from '../models/SkillSwapProject'; // For back-compat/aliasing
import { AuthRequest } from '../middleware/auth';

/**
 * SkillSwap: Create Internship (Company only)
 */
export const createInternship = async (req: AuthRequest, res: Response) => {
    try {
        if (req.user?.role !== 'company' && req.user?.role !== 'founder' && req.user?.role !== 'admin') {
            return res.status(403).json({ message: 'Only companies or founders can post internships' });
        }

        const internship = await Internship.create({
            ...req.body,
            companyId: req.user.id,
            status: 'open'
        });

        res.status(201).json(internship);
    } catch (error: any) {
        res.status(500).json({ message: 'Error creating internship', error: error.message });
    }
};

/**
 * SkillSwap: Internship Feed (Public discovery within module)
 */
export const getInternshipFeed = async (req: AuthRequest, res: Response) => {
    try {
        const internships = await Internship.find({ status: 'open' })
            .populate('companyId', 'firstName lastName companyName')
            .sort({ createdAt: -1 });
        res.json(internships);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching feed', error: error.message });
    }
};

/**
 * SkillSwap: Get Internship Details
 */
export const getInternshipById = async (req: AuthRequest, res: Response) => {
    try {
        const internship = await Internship.findById(req.params.id)
            .populate('companyId', 'firstName lastName email companyName');
        if (!internship) return res.status(404).json({ message: 'Internship not found' });
        res.json(internship);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching internship', error: error.message });
    }
};

/**
 * SkillSwap: Apply (Teen/Student only)
 */
export const applyForInternship = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const studentId = req.user?.id;

        const internship = await Internship.findById(id);
        if (!internship) return res.status(404).json({ message: 'Internship not found' });

        if (internship.status !== 'open') {
            return res.status(400).json({ message: 'Internship is no longer open for applications' });
        }

        // Update the internship to record the interest
        // For IBF, we use status 'pending_parent' to trigger parent approval flow
        internship.teenId = studentId;
        internship.status = 'pending_parent';

        await internship.save();

        res.json({
            message: 'Application initiated. Awaiting parent approval.',
            status: internship.status
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Error applying', error: error.message });
    }
};

/**
 * SkillSwap: My Listings (Company/Founder only)
 */
export const getMyListings = async (req: AuthRequest, res: Response) => {
    try {
        const companyId = req.user?.id;
        const internships = await Internship.find({ companyId })
            .select('title status teenId createdAt')
            .populate('teenId', 'firstName lastName');

        res.json(internships);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching listings', error: error.message });
    }
};

/**
 * SkillSwap: My Active Internships (Student only)
 */
export const getMyActiveInternships = async (req: AuthRequest, res: Response) => {
    try {
        const studentId = req.user?.id;
        const internships = await Internship.find({
            teenId: studentId,
            status: { $in: ['pending_parent', 'in_progress'] }
        }).populate('companyId', 'firstName lastName companyName');

        res.json(internships);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching active internships', error: error.message });
    }
};

/**
 * SkillSwap: Seed (Dev only)
 */
export const seedSkillSwap = async (req: Request, res: Response) => {
    try {
        const count = await Internship.countDocuments();
        if (count > 0) return res.json({ message: 'Already seeded' });

        let company = await User.findOne({ email: 'company@ibf.com' });
        if (!company) {
            company = await User.create({
                email: 'company@ibf.com',
                password: 'password123',
                role: 'company',
                companyName: 'TechEdu Corp',
                isVerified: true,
                moduleAccess: ['skillswap']
            });
        }

        const internships = [
            {
                title: 'Frontend Development Micro-Internship',
                description: 'Build a small React component library for our UI team.',
                companyId: company._id,
                skillsRequired: ['React', 'CSS', 'Storybook'],
                durationWeeks: 2,
                learningOutcomes: ['Component-based design', 'Testing UI with Storybook'],
                status: 'open',
                parentApproval: { required: true }
            },
            {
                title: 'Data Entry Automation',
                description: 'Create a Python script to automate weekly report generation.',
                companyId: company._id,
                skillsRequired: ['Python', 'Pandas', 'Excel'],
                durationWeeks: 1,
                learningOutcomes: ['Data manipulation in Python', 'Scripting'],
                status: 'open',
                parentApproval: { required: true }
            }
        ];

        await Internship.insertMany(internships);

        // Also seed SkillSwapProject for back-compat if UI uses it
        const projects = internships.map(i => ({
            title: i.title,
            description: i.description,
            startupId: i.companyId,
            difficultyTier: 'Builder',
            skillsRequired: i.skillsRequired.map(s => ({ name: s, level: 'beginner' })),
            status: 'open',
            isRemote: true
        }));
        await SkillSwapProject.create(projects);

        res.json({ message: 'SkillSwap seeded', internships });
    } catch (error: any) {
        res.status(500).json({ message: 'Seeding failed', error: error.message });
    }
};

/**
 * SkillSwap: Update Internship/Applicant Status (Company only)
 */
export const updateApplicantStatus = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params; // internship id
        const { status } = req.body;

        const internship = await Internship.findById(id);
        if (!internship) return res.status(404).json({ message: 'Internship not found' });

        // Security: Only company owner can update
        if (internship.companyId.toString() !== req.user?.id && req.user?.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to manage this internship' });
        }

        // Validate status transition
        const validStatuses = ['open', 'in_progress', 'completed', 'rejected', 'closed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        internship.status = status;
        if (status === 'rejected') {
            // If rejected, clear the teenId and reopen if needed, or just mark as closed
            internship.teenId = undefined;
            internship.status = 'open'; // Reopen for others
        }

        await internship.save();
        res.json(internship);
    } catch (error: any) {
        res.status(500).json({ message: 'Error updating status', error: error.message });
    }
};

export const getApplicantsList = async (req: AuthRequest, res: Response) => {
    try {
        const companyId = req.user?.id;
        // Find all internships for this company that have an applicant
        const internships = await Internship.find({
            companyId,
            teenId: { $exists: true }
        }).populate('teenId', 'firstName lastName avatar xp level');

        // Map to a format the frontend likes
        const applicants = internships.map(i => ({
            id: i._id, // Using internship ID as the unique row ID for simplicity in this flow
            student: i.teenId!,
            internshipId: i._id,
            internshipTitle: i.title,
            matchScore: i.matchScore || 90, // Use recorded match score if available
            status: i.status === 'pending_parent' ? 'pending' : i.status,
            appliedAt: i.updatedAt!,
            parentApproved: i.status !== 'pending_parent' && i.status !== 'open', // Simplification
            skills: i.skillsRequired,
            compensation: undefined // All internships are now free
        }));

        res.json(applicants);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching applicants', error: error.message });
    }
};

/**
 * SkillSwap: Get CSR Impact Reporting (Company only)
 */
export const getCSRImpact = async (req: AuthRequest, res: Response) => {
    try {
        const companyId = req.user?.id;

        const completedInternships = await Internship.find({
            companyId,
            status: 'completed'
        });

        const studentsReached = await Internship.distinct('teenId', { companyId, status: 'completed' });

        // Simple impact score calculation
        const totalImpactScore = completedInternships.length * 1000 + studentsReached.length * 500;

        // Mocking the time-series data for the chart unless we track historical impact
        const impactGrowth = [
            { month: 'Jan', score: 1200 },
            { month: 'Feb', score: 1900 },
            { month: 'Mar', score: 2400 },
            { month: 'Apr', score: 3800 },
            { month: 'May', score: 5200 },
            { month: 'Jun', score: totalImpactScore || 6500 },
        ];

        const skillDistribution = [
            { name: 'Coding', value: 45 },
            { name: 'Design', value: 25 },
            { name: 'Marketing', value: 20 },
            { name: 'Leadership', value: 10 },
        ];

        res.json({
            totalImpactScore,
            studentsReached: studentsReached.length,
            hoursVolunteered: completedInternships.length * 40, // Assume 40h avg
            carbonOffsetEquivalent: (completedInternships.length * 0.5).toFixed(1),
            impactGrowth,
            skillDistribution
        });

    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching CSR impact', error: error.message });
    }
};
