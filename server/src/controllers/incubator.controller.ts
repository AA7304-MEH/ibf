import { Request, Response } from 'express';
import Startup from '../models/Startup';
import User from '../models/User';
import { incubatorService } from '../services/incubator.service';
import { GamificationEngine } from '../services/GamificationEngine';

// Helper to generate ID (still useful for some internal logic if needed, but Mongoose does it automatically)
const genId = () => Math.random().toString(36).substr(2, 9);

export const getStartups = async (req: Request, res: Response) => {
    try {
        let query: any = {};

        // Filtering
        if (req.query.stage) query.stage = req.query.stage;
        if (req.query.industry) query.industry = req.query.industry;
        if (req.query.search) {
            const search = (req.query.search as string).toLowerCase();
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const results = await Startup.find(query).populate('founderId', 'firstName lastName email');
        res.json(results);
    } catch (error) {
        console.error('Error fetching startups:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getStartupById = async (req: Request, res: Response) => {
    try {
        const startup = await Startup.findById(req.params.id).populate('founderId', 'firstName lastName email');
        if (!startup) return res.status(404).json({ message: 'Startup not found' });
        res.json(startup);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const createStartup = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user ? (req as any).user.id : null;

        const newStartup = await Startup.create({
            ...req.body,
            founderId: userId,
            incubatorStatus: 'applied'
        });

        // Award XP for starting a startup journey
        if (userId) {
            await GamificationEngine.awardXP(userId, 'INTERNSHIP_MILESTONE');
        }

        res.status(201).json(newStartup);
    } catch (error) {
        console.error('Error creating startup:', error);
        res.status(500).json({ message: 'Failed to create startup' });
    }
};

export const seedIncubator = async (req: Request, res: Response) => {
    try {
        const count = await Startup.countDocuments();
        if (count > 0) return res.json({ message: 'Already seeded' });

        let founder = await User.findOne({ email: 'founder@ibf.com' });
        if (!founder) {
            founder = await User.create({
                email: 'founder@ibf.com',
                password: 'password123',
                role: 'founder',
                isVerified: true,
                moduleAccess: ['incubator']
            });
        }

        const startups = [
            {
                name: 'TechFlow',
                logo: 'https://placehold.co/150x150/2563eb/white?text=TF',
                tagline: 'AI for Supply Chain',
                description: 'Optimizing logistics with machine learning.',
                industry: 'Logistics',
                founderId: founder._id,
                stage: 'mvp',
                incubatorStatus: 'accepted',
                cohort: 'Winter 2026',
                metrics: { users: 150, revenue: 5000, growthRate: 20 },
                teamSize: 3,
                foundedDate: new Date('2025-01-01')
            },
            {
                name: 'MediConnect',
                logo: 'https://placehold.co/150x150/10b981/white?text=MC',
                tagline: 'Telehealth for Rural Areas',
                description: 'Connecting rural patients with top doctors.',
                industry: 'HealthTech',
                founderId: founder._id,
                stage: 'prototype',
                incubatorStatus: 'applied',
                metrics: { users: 50, revenue: 0, growthRate: 10 },
                teamSize: 2
            }
        ];

        await Startup.insertMany(startups);
        res.json({ message: 'Seeding successful', startups });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Seeding failed' });
    }
};
export const getFounderCopilotAdvice = async (req: Request, res: Response) => {
    try {
        const { startupId, prompt } = req.body;
        if (!startupId || !prompt) {
            return res.status(400).json({ message: 'Startup ID and prompt are required' });
        }

        const advice = await incubatorService.getFounderAdvice(startupId, prompt);
        res.json({ advice });
    } catch (error) {
        console.error('Founder Copilot Controller Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
