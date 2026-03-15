import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Task from './models/Task';

dotenv.config({ path: path.join(__dirname, '../.env') });

const tasks = [
    // INCUBATOR TASKS
    {
        title: 'Pitch Deck Review - Series A',
        description: 'Review a startup pitch deck and provide detailed feedback on the market analysis slide.',
        module: 'incubator',
        reward: 15000, // ₹150
        status: 'active',
        difficulty: 'intermediate',
        estimatedTime: '45 mins',
        category: 'Analysis',
        instructions: 'Read the attached PDF, focus on the market size calculation (TAM/SAM/SOM), and write a 200-word critique.',
        requirements: {
            minLevel: 1,
            skills: ['Startup Strategy', 'Market Research']
        },
        inventory: 50,
        submissionType: 'text'
    },
    {
        title: 'Customer Discovery Call Summary',
        description: 'Listen to a 10-minute customer interview recording and summarize the top 3 pain points.',
        module: 'incubator',
        reward: 7500, // ₹75
        status: 'active',
        difficulty: 'beginner',
        estimatedTime: '20 mins',
        category: 'Product',
        instructions: 'Identify the primary roadblocks mentioned by the interviewee and suggest one feature improvement.',
        inventory: 100,
        submissionType: 'text'
    },
    // COLLAB MARKET TASKS
    {
        title: 'Logo Concept Sketch (Hand-drawn)',
        description: 'Scan and upload a hand-drawn logo concept for a "GreenTech" startup.',
        module: 'collab',
        reward: 20000, // ₹200
        status: 'active',
        difficulty: 'intermediate',
        estimatedTime: '60 mins',
        category: 'Design',
        instructions: 'Focus on minimalism and sustainable symbols (leaves, solar, etc.). Upload a clear photo of your sketch.',
        inventory: 20,
        submissionType: 'file'
    },
    {
        title: 'Alpha Testing: Mobile App Navigation',
        description: 'Test the navigation flow of our new Beta app and report any broken links.',
        module: 'collab',
        reward: 5000, // ₹50
        status: 'active',
        difficulty: 'beginner',
        estimatedTime: '15 mins',
        category: 'Quality Assurance',
        instructions: 'Follow the test script provided in the link. Report any lag or layout shifts.',
        inventory: 200,
        submissionType: 'text'
    },
    // SKILLSWAP BOUNTIES
    {
        title: 'Python Script: Data Sanitization',
        description: 'Write a simple Python script to clean a CSV file of null values.',
        module: 'skillswap',
        reward: 25000, // ₹250
        status: 'active',
        difficulty: 'advanced',
        estimatedTime: '90 mins',
        category: 'Development',
        instructions: 'Input should be any standard CSV. Output should be clean.csv. Paste your code in the box.',
        inventory: 10,
        submissionType: 'text'
    },
    {
        title: 'Explain "Quantum Entanglement" like I am 5',
        description: 'Create a simple, 100-word explanation for a complex physics concept.',
        module: 'skillswap',
        reward: 3500, // ₹35
        status: 'active',
        difficulty: 'beginner',
        estimatedTime: '10 mins',
        category: 'Education',
        instructions: 'Use analogies! No jargon allowed.',
        inventory: 500,
        submissionType: 'text'
    }
];

async function seed() {
    try {
        const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/skillbridge';
        console.log(`Connecting to ${uri}...`);
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');

        // Clear existing tasks to avoid duplicates if re-run
        await Task.deleteMany({ module: { $in: ['incubator', 'collab', 'skillswap'] } });
        console.log('Cleared existing marketplace tasks');

        await Task.insertMany(tasks);
        console.log('Successfully seeded 6 marketplace tasks');

        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
}

seed();
