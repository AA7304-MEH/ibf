import { Request, Response } from 'express';
import Project from '../models/Project';
import User from '../models/User';
import TalentProfile from '../models/TalentProfile';
import CollabApplication from '../models/CollabApplication';
import { GamificationEngine } from '../services/GamificationEngine';

// Helper
const genId = () => Math.random().toString(36).substr(2, 9);

// SEED DATA
export const seedCollab = async (req: Request, res: Response) => {
    try {
        const count = await TalentProfile.countDocuments();
        if (count > 0) return res.json({ message: 'Already seeded' });

        let user = await User.findOne({ email: 'founder@ibf.com' });
        if (!user) {
            user = await User.create({
                email: 'founder@ibf.com',
                password: 'password123',
                role: 'founder',
                isVerified: true,
                moduleAccess: ['incubator', 'collab']
            });
        }

        const t1 = {
            userId: new User()._id,
            name: 'Sarah Designer',
            headline: 'Senior UI/UX Designer',
            bio: 'Passionate about creating intuitive and beautiful user experiences.',
            skills: [
                { name: 'Figma', level: 'expert', years: 5 },
                { name: 'React', level: 'intermediate', years: 2 }
            ],
            rates: { hourly: 85, projectMin: 1000 },
            availability: { status: 'available', hoursPerWeek: 20 },
            statistics: { successScore: 98, completedProjects: 12 },
            badges: ['top-rated', 'verified']
        };

        const talentData = [
            t1,
            {
                userId: new User()._id,
                name: 'Mike Developer',
                headline: 'Full Stack Engineer',
                bio: 'Expert in Node.js, React, and AWS.',
                skills: [{ name: 'Node.js', level: 'expert', years: 6 }],
                rates: { hourly: 120, projectMin: 2000 },
                availability: { status: 'booked', nextAvailable: new Date('2026-02-15') },
                statistics: { successScore: 100, completedProjects: 25 },
                badges: ['top-rated']
            }
        ];

        await TalentProfile.insertMany(talentData);

        const projectsData = [
            {
                title: 'Redesign SaaS Dashboard',
                description: 'Looking for a UI/UX designer to modernize our analytics dashboard.',
                founderId: user._id,
                skillsRequired: ['Figma', 'UI Design', 'Dashboard'],
                budget: 3500,
                duration: '1-3 months',
                status: 'open',
                milestones: [
                    { title: 'Initial Wireframes', completed: true, dueDate: new Date() },
                    { title: 'Final Prototype', completed: false, dueDate: new Date('2026-04-01') }
                ]
            },
            {
                title: 'Build Mobile App MVP',
                description: 'Need a React Native developer to build our initial MVP.',
                founderId: user._id,
                skillsRequired: ['React Native', 'Firebase', 'Mobile'],
                budget: 8000,
                duration: '1-3 months',
                status: 'open'
            }
        ];

        await Project.insertMany(projectsData);
        res.json({ message: 'Collab Data Seeded' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Seeding failed', error });
    }
};

export const getProjects = async (req: Request, res: Response) => {
    try {
        const results = await Project.find().populate('founderId', 'firstName lastName email companyName');
        res.json(results);
    } catch (e) {
        res.status(500).json({ message: 'Error fetching projects' });
    }
};

export const getProjectById = async (req: Request, res: Response) => {
    try {
        const p = await Project.findById(req.params.id).populate('founderId', 'firstName lastName email companyName');
        if (!p) return res.status(404).json({ message: 'Project not found' });
        res.json(p);
    } catch (e) {
        res.status(500).json({ message: 'Error' });
    }
};

export const createProject = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id || (req as any).user?._id;

        const newProject = await Project.create({
            ...req.body,
            founderId: userId,
            status: 'open'
        });

        res.status(201).json(newProject);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Creation failed' });
    }
};

export const getTalentProfiles = async (req: Request, res: Response) => {
    try {
        let query: any = {};
        if (req.query.skill) {
            query['skills.name'] = { $regex: req.query.skill, $options: 'i' };
        }
        const results = await TalentProfile.find(query);
        res.json(results);
    } catch (e) {
        res.status(500).json({ message: 'Error' });
    }
};

export const getTalentById = async (req: Request, res: Response) => {
    try {
        const t = await TalentProfile.findById(req.params.id);
        if (!t) return res.status(404).json({ message: 'Talent not found' });
        res.json(t);
    } catch (e) {
        res.status(500).json({ message: 'Error' });
    }
};

export const applyToProject = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id || (req as any).user?._id;
        const { projectId, coverLetter, proposedRate, estimatedDuration } = req.body;

        if (!projectId || !coverLetter) {
            return res.status(400).json({ message: 'Project ID and cover letter are required' });
        }

        // Check if already applied
        const existing = await CollabApplication.findOne({ project: projectId, applicant: userId });
        if (existing) {
            return res.status(400).json({ message: 'You have already applied to this project' });
        }

        const application = await CollabApplication.create({
            project: projectId,
            applicant: userId,
            coverLetter,
            proposedRate,
            estimatedDuration,
            status: 'pending'
        });

        // Award XP for applying
        await GamificationEngine.awardXP(userId, 'TASK_COMPLETE');

        res.status(201).json(application);
    } catch (e: any) {
        console.error('Apply to project error:', e);
        if (e.code === 11000) {
            return res.status(400).json({ message: 'You have already applied to this project' });
        }
        res.status(500).json({ message: 'Error submitting application' });
    }
};

export const getApplicationsForProject = async (req: Request, res: Response) => {
    try {
        const apps = await CollabApplication.find({ project: req.params.projectId }).populate('applicant', 'firstName lastName email avatar headline');
        res.json(apps);
    } catch (e) {
        res.status(500).json({ message: 'Error' });
    }
};

export const hireTalent = async (req: Request, res: Response) => {
    try {
        const { applicationId } = req.body;
        const application = await CollabApplication.findById(applicationId);
        if (!application) return res.status(404).json({ message: 'Application not found' });

        const project = await Project.findById(application.project);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        // Update project
        project.hiredTalentId = application.applicant;
        project.status = 'in_progress';
        await project.save();

        // Update application
        application.status = 'hired';
        await application.save();

        // Reject others
        await CollabApplication.updateMany(
            { project: project._id, _id: { $ne: application._id } },
            { status: 'rejected' }
        );

        res.json({ message: 'Talent hired successfully', project });
    } catch (e) {
        res.status(500).json({ message: 'Hiring failed' });
    }
};

export const updateProjectMilestone = async (req: Request, res: Response) => {
    try {
        const { projectId, milestoneIndex, completed } = req.body;
        const project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        if (!project.milestones[milestoneIndex]) {
            return res.status(400).json({ message: 'Invalid milestone index' });
        }

        project.milestones[milestoneIndex].completed = completed;
        await project.save();

        res.json(project);
    } catch (e) {
        res.status(500).json({ message: 'Error' });
    }
};
