import { Request, Response } from 'express';
import SkillSwapProject from '../models/SkillSwapProject';
import CollabApplication from '../models/CollabApplication'; // Using generic project app model
import Startup from '../models/Startup';
import User from '../models/User';
import { GamificationEngine } from '../services/GamificationEngine';

// Helper
const genId = () => Math.random().toString(36).substr(2, 9);

// SEED DATA
export const seedSkillSwap = async (req: Request, res: Response) => {
    try {
        console.log('Seeding SkillSwap Data (DB)...');
        const count = await SkillSwapProject.countDocuments();
        if (count > 0) return res.json({ message: 'Already seeded' });

        // Find a startup to attach projects to
        let startup = await Startup.findOne();
        if (!startup) {
            // Need a startup to post projects
            // If seedIncubator ran, we have one. If not, creating dummy maybe?
            // Safer to just try finding one, or user 'admin'
            console.log('No startup found for SkillSwap seeding, projects might be orphaned (using mock ID)');
        }

        // Seed Projects (Micro-Internships)
        const p1 = {
            title: "Build a React Landing Page",
            description: "Create a high-converting landing page for a local bakery. Great for beginners learning CSS Grid.",
            startupId: startup?._id || new User()._id, // Fallback
            skillsRequired: [{ name: "React", level: 'beginner' }, { name: "CSS", level: 'beginner' }],
            difficultyTier: "Builder",
            learningStyleTags: ["Visual", "Practical"],
            skillsToLearn: ["Conversion Optimization"],
            durationWeeks: 2,
            estimatedHours: 10,
            status: "open",
            isRemote: true
        };
        const p2 = {
            title: "Python Data Analysis Script",
            description: "Write a script to clean and visualize a CSV dataset of weather patterns.",
            startupId: startup?._id || new User()._id,
            skillsRequired: [{ name: "Python", level: 'intermediate' }],
            difficultyTier: "Innovator", // Actually Investigator in mock, but strictly Enum in model? Model says 'Innovator' is valid.
            learningStyleTags: ["Theoretical"],
            skillsToLearn: ["Data Science", "Data Cleaning"],
            durationWeeks: 1,
            estimatedHours: 5,
            status: "open",
            isRemote: true
        };

        await SkillSwapProject.create([p1, p2]); // Mongoose create accepts array

        res.json({ message: 'SkillSwap Data Seeded' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Seeding failed', error });
    }
};

// CONTROLLERS
export const getProjects = async (req: Request, res: Response) => {
    try {
        let query: any = {};
        // Filter by difficulty
        if (req.query.difficulty) {
            query.difficultyTier = req.query.difficulty;
        }

        const results = await SkillSwapProject.find(query);
        res.json(results);
    } catch (e) {
        res.status(500).json({ message: 'Error fetching projects' });
    }
};

export const getProjectById = async (req: Request, res: Response) => {
    try {
        const p = await SkillSwapProject.findById(req.params.id);
        if (!p) return res.status(404).json({ message: 'Project not found' });
        res.json(p);
    } catch (e) {
        res.status(500).json({ message: 'Error' });
    }
};

export const applyToProject = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id || (req as any).user?._id;
        // Check for existing application
        const existing = await CollabApplication.findOne({
            applicant: userId,
            project: req.body.projectId
        });

        if (existing) {
            return res.status(400).json({ message: 'Already applied' });
        }

        const newApp = await CollabApplication.create({
            project: req.body.projectId,
            applicant: userId, // Student
            coverLetter: req.body.message, // Map message to coverLetter
            status: 'pending'
        });

        // Award XP for skillswap engagement
        await GamificationEngine.awardXP(userId, 'TASK_COMPLETE');

        res.status(201).json(newApp);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Application failed' });
    }
};
