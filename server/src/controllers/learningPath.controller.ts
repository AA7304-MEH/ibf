import { Request, Response } from 'express';
import LearningPath, { ILearningPath } from '../models/LearningPath';
import { AuthRequest } from '../middleware/auth';
import mongoose from 'mongoose';

// Generate a new Learning Path (Mock AI generation for MVP)
export const generateLearningPath = async (req: AuthRequest, res: Response) => {
    try {
        console.log('Generating Learning Path...');
        const studentId = req.user?.id;
        console.log('Student ID:', studentId);
        const { goal } = req.body;

        // 1. Check if path already exists
        const existingPath = await LearningPath.findOne({ studentId, status: 'active' });
        if (existingPath) {
            return res.status(400).json({ message: 'Active learning path already exists', path: existingPath });
        }

        // 2. "AI" Generation Logic (Template based for now)
        let title = goal || "General Skill Progression";
        let milestones = [];

        if (title.toLowerCase().includes('react') || title.toLowerCase().includes('frontend')) {
            milestones = [
                {
                    id: new mongoose.Types.ObjectId().toString(),
                    title: 'HTML & CSS Mastery',
                    type: 'skill',
                    status: 'available',
                    prerequisites: [],
                    resources: [{ title: 'MDN Web Docs', url: 'https://developer.mozilla.org', type: 'article' }],
                    skillReward: { skill: 'HTML/CSS', points: 100 }
                },
                {
                    id: new mongoose.Types.ObjectId().toString(),
                    title: 'JavaScript Basics',
                    type: 'skill',
                    status: 'locked',
                    prerequisites: [], // Logic to link to previous ID would go here
                    resources: [{ title: 'JS Info', url: 'https://javascript.info', type: 'article' }],
                    skillReward: { skill: 'JavaScript', points: 150 }
                },
                {
                    id: new mongoose.Types.ObjectId().toString(),
                    title: 'Build a Personal Portfolio',
                    type: 'project',
                    status: 'locked',
                    prerequisites: [],
                    resources: [],
                    skillReward: { skill: 'React', points: 300 }
                }
            ];
        } else {
            // Default / Backend Path
            milestones = [
                {
                    id: new mongoose.Types.ObjectId().toString(),
                    title: 'Node.js Fundamentals',
                    type: 'skill',
                    status: 'available',
                    prerequisites: [],
                    resources: [{ title: 'Nodejs.org', url: 'https://nodejs.org', type: 'article' }],
                    skillReward: { skill: 'Node.js', points: 150 }
                },
                {
                    id: new mongoose.Types.ObjectId().toString(),
                    title: 'Database Design (MongoDB)',
                    type: 'skill',
                    status: 'locked', // Should set based on prereqs
                    prerequisites: [],
                    resources: [{ title: 'Mongoose Docs', url: 'https://mongoosejs.com', type: 'article' }],
                    skillReward: { skill: 'MongoDB', points: 200 }
                },
                {
                    id: new mongoose.Types.ObjectId().toString(),
                    title: 'Build a REST API',
                    type: 'project',
                    status: 'locked',
                    prerequisites: [],
                    resources: [],
                    skillReward: { skill: 'API Design', points: 300 }
                }
            ];
        }

        // 3. Create Path
        const newPath = await LearningPath.create({
            studentId,
            title: `Path to ${title}`,
            status: 'active',
            skillDNA: {
                technicalProfile: {},
                learningStyle: 'Visual', // Default or fetch from profile
                gaps: []
            },
            milestones,
            currentFocus: [milestones[0].id],
            progress: 0
        });

        res.status(201).json(newPath);

    } catch (error: any) {
        res.status(500).json({ message: 'Error generating path', error: error.message });
    }
};

export const getLearningPath = async (req: AuthRequest, res: Response) => {
    try {
        const studentId = req.user?.id;
        const path = await LearningPath.findOne({ studentId, status: 'active' });

        if (!path) return res.status(404).json({ message: 'No active learning path found' });

        res.json(path);

    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching path', error: error.message });
    }
};

export const updateMilestoneStatus = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params; // Path ID
        const { milestoneId, status } = req.body; // 'completed'

        const path = await LearningPath.findById(id);
        if (!path) return res.status(404).json({ message: 'Path not found' });

        const milestone = path.milestones.find(m => m.id === milestoneId);
        if (!milestone) return res.status(404).json({ message: 'Milestone not found' });

        milestone.status = status;
        if (status === 'completed') {
            milestone.completedAt = new Date();
            // Unlock next? Logic could be complex, for now simplistic

            // Update Overall Progress
            const completedCount = path.milestones.filter(m => m.status === 'completed').length;
            path.progress = Math.round((completedCount / path.milestones.length) * 100);
        }

        await path.save();
        res.json(path);

    } catch (error: any) {
        res.status(500).json({ message: 'Error updating milestone', error: error.message });
    }
};
