import { Request, Response } from 'express';
// Mock Data Store
let startups: any[] = [];
let applications: any[] = [];
let cohorts: any[] = [];
let users: any[] = []; // minimal mock users if needed

// Helper to generate ID
const genId = () => Math.random().toString(36).substr(2, 9);

export const getStartups = async (req: Request, res: Response) => {
    try {
        let results = [...startups];

        // Filtering
        if (req.query.stage) results = results.filter(s => s.stage === req.query.stage);
        if (req.query.industry) results = results.filter(s => s.industry === req.query.industry);
        if (req.query.search) {
            const search = (req.query.search as string).toLowerCase();
            results = results.filter(s =>
                s.name.toLowerCase().includes(search) ||
                s.description.toLowerCase().includes(search)
            );
        }

        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getStartupById = async (req: Request, res: Response) => {
    const startup = startups.find(s => s._id === req.params.id);
    if (!startup) return res.status(404).json({ message: 'Startup not found' });
    res.json(startup);
};

export const createStartup = async (req: Request, res: Response) => {
    const newStartup = {
        _id: genId(),
        ...req.body,
        founder: (req as any).user ? (req as any).user.id : 'mock_founder_id',
        incubatorStatus: 'applied',
        createdAt: new Date()
    };
    startups.push(newStartup);
    res.status(201).json(newStartup);
};

export const seedIncubator = async (req: Request, res: Response) => {
    console.log('Seeding Mock Data...');

    if (startups.length > 0) return res.json({ message: 'Already seeded' });

    // Seed Cohort
    const cohort = {
        _id: genId(),
        name: 'Winter 2026',
        startDate: new Date('2026-01-10'),
        endDate: new Date('2026-04-10'),
        status: 'active'
    };
    cohorts.push(cohort);

    // Seed Startups
    const s1 = {
        _id: genId(),
        name: 'TechFlow',
        logo: 'https://placehold.co/150x150/2563eb/white?text=TF',
        tagline: 'AI for Supply Chain',
        description: 'Optimizing logistics with machine learning.',
        stage: 'mvp',
        industry: 'Logistics',
        founder: { _id: 'f1', name: 'Alice Founder', email: 'alice@tech.com' },
        incubatorStatus: 'accepted',
        cohort: cohort.name,
        funding: { amount: 50000, equity: 7, valuation: 714000 },
        metrics: { users: 150, revenue: 5000, growthRate: 20 },
        team: [{ name: 'Alice Founder', role: 'CEO' }]
    };

    const s2 = {
        _id: genId(),
        name: 'MediConnect',
        logo: 'https://placehold.co/150x150/10b981/white?text=MC',
        tagline: 'Telehealth for Rural Areas',
        description: 'Connecting rural patients with top doctors.',
        stage: 'prototype',
        industry: 'HealthTech',
        founder: { _id: 'f2', name: 'Bob Founder', email: 'bob@health.com' },
        incubatorStatus: 'applied',
        metrics: { users: 50, revenue: 0, growthRate: 10 }
    };

    startups.push(s1, s2);

    res.json({ message: 'Seeding successful', startups });
};
