import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User';
import Startup from './models/Startup';
import Application from './models/Application';
import Cohort from './models/Cohort';
import bcrypt from 'bcryptjs';

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ibf');
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

const seedData = async () => {
    await connectDB();

    // Clear existing data (optional, be careful in prod)
    // await Startup.deleteMany({});
    // await Application.deleteMany({});
    // await Cohort.deleteMany({});
    // await User.deleteMany({ role: { $in: ['founder', 'mentor'] } });

    console.log('Seeding Incubator Data...');

    // 1. Create Cohort
    const cohort = await Cohort.create({
        name: 'Winter 2026',
        startDate: new Date('2026-01-10'),
        endDate: new Date('2026-04-10'),
        demoDay: new Date('2026-04-15'),
        status: 'active'
    });
    console.log('Cohort created:', cohort.name);

    // 2. Create Users (Founders & Mentors)
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('password123', salt);

    const founder1 = await User.create({
        email: 'founder1@tech.com',
        password,
        role: 'founder',
        isVerified: true
    });

    const founder2 = await User.create({
        email: 'founder2@health.com',
        password,
        role: 'founder',
        isVerified: true
    });

    const mentor1 = await User.create({
        email: 'mentor1@vc.com',
        password,
        role: 'mentor',
        isVerified: true
    });

    console.log('Users created: founders & mentor');

    // 3. Create Startups
    const startup1 = await Startup.create({
        name: 'TechFlow',
        logo: 'https://via.placeholder.com/150',
        tagline: 'AI for Supply Chain',
        description: 'Optimizing logistics with machine learning.',
        problem: 'Inefficient routing costs billions.',
        solution: 'Predictive routing algorithms.',
        marketSize: 5000000000,
        businessModel: 'SaaS',
        stage: 'mvp',
        team: [{ name: 'Alice Founder', role: 'CEO', bio: 'Ex-Amazon Logistics' }],
        metrics: { users: 150, revenue: 5000, growthRate: 20 },
        incubatorStatus: 'accepted',
        cohort: cohort.name,
        founder: founder1._id,
        funding: { amount: 50000, equity: 7, valuation: 714000, date: new Date() },
        mentors: [mentor1._id],
        industry: 'Logistics',
        pitch: 'AI Supply Chain Optimization'
    });

    const startup2 = await Startup.create({
        name: 'MediConnect',
        logo: 'https://via.placeholder.com/150',
        tagline: 'Telehealth for Rural Areas',
        description: 'Connecting rural patients with top doctors.',
        problem: 'Lack of specialists in rural areas.',
        solution: 'Mobile-first telehealth platform.',
        marketSize: 2000000000,
        businessModel: 'Marketplace',
        stage: 'prototype',
        team: [{ name: 'Bob Founder', role: 'CTO', bio: 'Dr. turned dev' }],
        metrics: { users: 50, revenue: 0, growthRate: 10 },
        incubatorStatus: 'applied',
        founder: founder2._id,
        industry: 'HealthTech',
        pitch: 'Rural Telehealth Access'
    });

    console.log('Startups created:', startup1.name, startup2.name);

    // 4. Create Applications
    await Application.create({
        startup: startup2._id,
        founder: founder2._id,
        status: 'submitted',
        submissionDate: new Date(),
        scores: { team: 8, product: 7, market: 9, total: 24 }
    });

    console.log('Application created for MediConnect');

    console.log('Seeding Complete!');
    process.exit(0);
};

seedData();
