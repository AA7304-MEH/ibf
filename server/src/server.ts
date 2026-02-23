import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import http from 'http';
import path from 'path';
import { socketService } from './services/socketService';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { logger } from './utils/logger';
import { validateEnv } from './utils/validateEnv';
import morgan from 'morgan';
import { errorHandler } from './middleware/errorHandler';

// Load env vars
dotenv.config();

// Validate before starting
validateEnv();

const app = express();
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Initialize Socket.io
socketService.init(server);

// Middleware
app.use(morgan('combined', { stream: { write: (message) => logger.http(message.trim()) } }));
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:5175',
        'http://localhost:5176',
        'http://localhost:5177',
        'http://127.0.0.1:5173'
    ],
    credentials: true
}));
app.use(express.json());

// Database Connection
let dbPromise: Promise<typeof mongoose> | null = null;

const connectDB = async () => {
    if (dbPromise) return dbPromise;

    const isLocal = !process.env.MONGODB_URI || process.env.MONGODB_URI.includes('username:password') || process.env.MONGODB_URI === 'mongodb://127.0.0.1:27017/skillbridge';
    let uri = process.env.MONGODB_URI as string;

    if (isLocal) {
        try {
            const mongod = await MongoMemoryServer.create();
            uri = mongod.getUri();
            logger.info('Using MongoDB Memory Server for local development');
        } catch (err) {
            logger.error('Failed to start MongoDB Memory Server, falling back to local port 27017');
            uri = 'mongodb://127.0.0.1:27017/skillbridge';
        }
    }

    dbPromise = mongoose.connect(uri).then(m => {
        logger.info('Connected to MongoDB');
        return m;
    }).catch(err => {
        logger.error('CRITICAL: MongoDB connection failed:', err);
        dbPromise = null;
        throw err;
    });

    return dbPromise;
};

export { dbPromise, connectDB };

// Seed Logic
const seedDatabase = async () => {
    try {
        const User = (await import('./models/User')).default;
        const Startup = (await import('./models/Startup')).default;
        const Project = (await import('./models/Project')).default;

        // 1. Admin
        let admin = await User.findOne({ email: 'admin@ibf.com' });
        if (!admin) {
            admin = await User.create({
                email: 'admin@ibf.com',
                password: 'admin123',
                role: 'admin',
                isVerified: true,
                moduleAccess: ['incubator', 'collab', 'skillswap']
            });
            logger.info('Admin user seeded');
        }

        // 2. Startups (Incubator)
        if (await Startup.countDocuments() === 0) {
            const industries = ['AgTech', 'FinTech', 'BioTech'];
            for (const ind of industries) {
                await Startup.create({
                    name: `${ind} Innovators`,
                    tagline: `Future of ${ind}`,
                    description: `A platform for ${ind} transformation.`,
                    industry: ind,
                    founderId: admin._id,
                    stage: 'mvp',
                    teamSize: 3,
                    foundedDate: new Date(),
                    metrics: { users: 0, revenue: 0, growthRate: 0 }
                });
            }
            logger.info('Startups seeded');
        }

        // 3. Projects (Collab)
        if (await Project.countDocuments() === 0) {
            await Project.create({
                title: "IBF Platform Dev",
                description: "Building the next-gen innovator bridge.",
                founderId: admin._id,
                skillsRequired: ["React", "Node.js"],
                duration: "6 months",
                budget: 10000,
                status: "open"
            });
            logger.info('Projects seeded');
        }
    } catch (error) {
        logger.error('Seeding failed:', error);
    }
};

// Routes
import authRoutes from './routes/auth.routes';
import incubatorRoutes from './routes/incubator.routes';
import collabRoutes from './routes/collab.routes';
import skillswapRoutes from './routes/skillswap.routes';
import wellbeingRoutes from './routes/wellbeing.routes';
import gamificationRoutes from './routes/gamification.routes';
import parentRoutes from './routes/parent.routes';

// Base Auth
app.use('/api/auth', authRoutes);

// Strict Module Prefixes
app.use('/api/incubator', incubatorRoutes);
app.use('/api/collab', collabRoutes);
app.use('/api/skillswap', skillswapRoutes);
app.use('/api/parent', parentRoutes);

// Shared Multi-Module Services
app.use('/api/wellbeing', wellbeingRoutes);
app.use('/api/gamification', gamificationRoutes);

// Serve Static Files (Production)
if (process.env.NODE_ENV === 'production') {
    const distPath = path.join(__dirname, '../../client/dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
    });
}

// Final Error Handling
app.use(errorHandler);

// Export for Vercel
export default app;

// Initialization
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    // Start Server Immediately (only for local/dedicated host)
    server.listen(PORT, () => {
        logger.info(`Server running on port ${PORT}`);
    });
}

// Always try to connect to DB and seed (including on Vercel)
connectDB().then(async () => {
    try {
        await seedDatabase();
    } catch (e) {
        logger.error('Seeding skipped (possibly already seeded or DB error)');
    }
});

// Graceful Shutdown
const shutdown = () => {
    console.log('Shutting down...');
    server.close(() => process.exit(0));
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
