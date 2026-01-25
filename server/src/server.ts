import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load env vars
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
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
const connectDB = async () => {
    try {
        console.log('Starting In-Memory MongoDB (Attempting to launch)...');
        const { MongoMemoryServer } = await import('mongodb-memory-server');

        // Increase timeout to 30s for slower environments
        const mongod = await MongoMemoryServer.create({
            instance: {
                dbPath: process.env.MONGO_DB_PATH || undefined, // Use explicit path if set, else temp
            },
            binary: {
                checkMD5: true,
            }
        });

        const uri = mongod.getUri();
        console.log('In-Memory MongoDB started at:', uri);
        await mongoose.connect(uri);
        console.log('Connected to In-Memory MongoDB');
    } catch (err) {
        console.error('Failed to start In-Memory MongoDB:', err);
        // Do not exit process immediately, let it run so we can at least return 500s instead of Network Error
        // process.exit(1); 
    }
};

// Seed Admin User
const seedAdmin = async () => {
    try {
        // Dynamic import to avoid circular dependencies if User model imports something that uses connection? 
        // Actually User model is fine.
        const User = (await import('./models/User')).default;

        const adminEmail = 'admin@ibf.com';
        const adminPassword = 'adminpassword123';

        const existingAdmin = await User.findOne({ email: adminEmail });

        if (!existingAdmin) {
            console.log('Seeding default admin user...');
            await User.create({
                email: adminEmail,
                password: adminPassword,
                role: 'admin',
                isVerified: true,
                isProfileComplete: true
            });
            console.log(`Admin user created: ${adminEmail} / ${adminPassword}`);
        } else {
            console.log('Admin user already exists.');
        }
    } catch (error) {
        console.error('Error seeding admin user:', error);
    }
};

// connectDB();
// console.log('MongoDB connection skipped (Mock Mode)');
// Note: In Mock Mode we actually DO connect to an in-memory DB in the connectDB function above.
// The previous "console.log('MongoDB connection skipped...')" 
// was likely outside the function call or confusingly placed if connectDB() wasn't called.
// Looking at lines 43-44: "connectDB();" is commented out? 
// If connectDB is commented out, then NO DB is connected? 
// Wait, the previous file view showed:
// 43: // connectDB();
// 44: console.log('MongoDB connection skipped (Mock Mode)');
// If connectDB is commented out, then mongoose is NOT connected, 
// and any DB operation will hang or fail (Mongoose buffers commands by default).
// BUT the user said "Mock Mode".
// IF the app is working, either it's NOT using mongoose for real operations (mocking at controller level?)
// OR connectDB SHOULD be called.
// Let's uncomment connectDB to ensure the in-memory DB starts, 
// AND add the seed function.

// Seed Mock Projects
const seedProjects = async () => {
    try {
        const Project = (await import('./models/Project')).default;
        const User = (await import('./models/User')).default;

        const count = await Project.countDocuments();
        if (count > 0) return;

        console.log('Seeding mock projects...');
        const admin = await User.findOne({ email: 'admin@ibf.com' });
        if (!admin) return;

        const projects = [
            {
                title: "Build a React Landing Page",
                description: "Create a high-converting landing page for a local bakery.",
                projectType: "skillswap",
                skillsRequired: ["React", "CSS", "Design"],
                skillswapDetails: {
                    difficultyTier: "Builder",
                    learningStyleTags: ["Visual", "Practical"],
                    skillsToLearn: ["Conversion Optimization"]
                },
                postedBy: admin._id,
                duration: "2 weeks",
                estimatedHours: 10,
                status: "open"
            },
            {
                title: "AI Chatbot Integration",
                description: "Integrate OpenAI API into an existing Node.js customer support tool.",
                projectType: "skillswap",
                skillsRequired: ["Node.js", "API", "JavaScript"],
                skillswapDetails: {
                    difficultyTier: "Innovator",
                    learningStyleTags: ["Theoretical", "Practical"],
                    skillsToLearn: ["AI Engineering", "Backend Security"]
                },
                postedBy: admin._id,
                duration: "3 weeks",
                estimatedHours: 20,
                status: "open"
            },
            {
                title: "Community Blog Content",
                description: "Write 5 technical articles about web development trends.",
                projectType: "skillswap",
                skillsRequired: ["Writing", "Research"],
                skillswapDetails: {
                    difficultyTier: "Explorer",
                    learningStyleTags: ["Visual"],
                    skillsToLearn: ["SEO", "Content Strategy"]
                },
                postedBy: admin._id,
                duration: "1 week",
                estimatedHours: 5,
                status: "open"
            }
        ];

        await Project.insertMany(projects);
        console.log('Mock projects seeded!');
    } catch (error) {
        console.error("Seeding error:", error);
    }
};

connectDB().then(async () => {
    await seedAdmin();
    await seedProjects();
});

// Routes
// Routes
import authRoutes from './routes/auth.routes';
import projectRoutes from './routes/project.routes';
import startupRoutes from './routes/startup.routes';
import incubatorRoutes from './routes/incubator.routes';
import wellbeingRoutes from './routes/wellbeing.routes';

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/startups', startupRoutes);
app.use('/api/incubator', incubatorRoutes);
app.use('/api/wellbeing', wellbeingRoutes);

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date() });
});

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Handle graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down...');
    server.close();
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('SIGINT received, shutting down...');
    server.close();
    process.exit(0);
});
