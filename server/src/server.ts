import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import http from 'http';
import path from 'path';
import { socketService } from './services/socketService';

import { logger } from './utils/logger';
import { validateEnv } from './utils/validateEnv';
import morgan from 'morgan';
import { errorHandler } from './middleware/errorHandler';

// Load env vars
dotenv.config();

// Validate before starting
validateEnv();

const app = express();
const PORT = process.env.PORT || 5001;
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
        'http://127.0.0.1:5173',
        'https://ibf-sage.vercel.app'
    ],
    credentials: true
}));
app.use(express.json());

// Database Connection
let dbPromise: Promise<typeof mongoose> | null = null;

const connectDB = async () => {
    if (dbPromise) return dbPromise;

    // Check if we require a local memory server. NEVER do this on VERCEL.
    const isLocal = (!process.env.MONGODB_URI || 
                     process.env.MONGODB_URI.includes('username:password') || 
                     process.env.MONGODB_URI === 'mongodb://127.0.0.1:27017/skillbridge' ||
                     process.env.MONGODB_URI.includes('@mongodb:27017')) 
                    && !process.env.VERCEL;
                    
    const isDockerUriOnVercel = process.env.VERCEL && process.env.MONGODB_URI?.includes('@mongodb:27017');
                    
    let uri = process.env.MONGODB_URI as string;

    if (isLocal) {
        try {
            logger.info('Starting MongoDB Memory Server (Local Dev Mode)...');
            // Dynamic import prevents Vercel from trying to bundle devDependencies
            const { MongoMemoryServer } = await import('mongodb-memory-server');
            const mongod = await MongoMemoryServer.create({
                instance: {
                    dbName: 'skillbridge'
                }
            });
            uri = mongod.getUri();
            logger.info(`MongoDB Memory Server started at: ${uri}`);
        } catch (err) {
            logger.error('Failed to start MongoDB Memory Server, falling back to local port 27017:', err);
            uri = 'mongodb://127.0.0.1:27017/skillbridge';
        }
    }

    if (isDockerUriOnVercel) {
        logger.warn('Detected Docker-style MONGODB_URI on Vercel. This will not work. Falling back to MOCK MODE.');
        dbPromise = Promise.resolve(mongoose);
        return dbPromise;
    }

    const connectionOptions = {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        bufferCommands: false // Disable buffering so it fails immediately if not connected
    };

    dbPromise = mongoose.connect(uri, connectionOptions).then(m => {
        logger.info('Connected to MongoDB');
        return m;
    }).catch(err => {
        logger.error('CRITICAL: MongoDB connection failed (Server will run in limited MOCK MODE):', err);
        dbPromise = null;
        // Do not throw, allow server to start
        return mongoose;
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
import adminRoutes from './routes/admin.routes';
import marketplaceRoutes from './routes/marketplace.routes';
import walletRoutes from './routes/wallet.routes';

// Health Check
app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// Base Auth
app.use('/api/auth', authRoutes);

// Strict Module Prefixes
app.use('/api/incubator', incubatorRoutes);
app.use('/api/collab', collabRoutes);
app.use('/api/skillswap', skillswapRoutes);
app.use('/api/parent', parentRoutes);
app.use('/api/admin', adminRoutes);

// Marketplace / Micro-Tasks
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/wallet', walletRoutes);

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
