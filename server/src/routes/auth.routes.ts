import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User';
import { gamificationService } from '../services/gamification.service';

const router = express.Router();

// Generate Token
const generateToken = (id: string, role: string) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET as string, {
        expiresIn: '30d',
    });
};

// Mock Database for Fallback
const MOCK_USERS = [
    {
        _id: new mongoose.Types.ObjectId(),
        email: 'admin@ibf.com',
        password: bcrypt.hashSync('admin123', 10),
        role: 'admin',
        firstName: 'System',
        lastName: 'Admin',
        moduleAccess: ['incubator', 'collab', 'skillswap']
    },
    {
        _id: new mongoose.Types.ObjectId(),
        email: 'founder@test.com',
        password: bcrypt.hashSync('founder123', 10),
        role: 'founder',
        firstName: 'Test',
        lastName: 'Founder',
        moduleAccess: ['incubator', 'collab', 'skillswap']
    },
    {
        _id: new mongoose.Types.ObjectId(),
        email: 'student@test.com',
        password: bcrypt.hashSync('student123', 10),
        role: 'student',
        firstName: 'Test',
        lastName: 'Student',
        moduleAccess: ['skillswap']
    }
];

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
    try {
        console.log("-----------------------------------------");
        console.log("[REGISTER DEBUG] Incoming Request Body:", JSON.stringify(req.body, null, 2));

        const {
            email,
            password,
            role,
            firstName,
            lastName,
            dateOfBirth,
            schoolDetails,
            parentInfo
        } = req.body;

        // 1. Determine default module access based on role (DO THIS BEFORE DB CHECK)
        let moduleAccess: string[] = [];
        if (['student', 'teen', 'parent', 'company'].includes(role)) moduleAccess = ['skillswap'];
        if (role === 'founder') moduleAccess = ['incubator', 'collab', 'skillswap'];
        if (role === 'talent') moduleAccess = ['collab'];
        if (role === 'admin') moduleAccess = ['incubator', 'collab', 'skillswap', 'admin'];

        // 2. CHECK DB STATUS
        const isDbConnected = mongoose.connection.readyState === 1;

        if (!isDbConnected) {
            console.warn("[REGISTER WARN] DB Not Connected. Using MOCK_USERS fallback.");

            // Mock Validation
            if (MOCK_USERS.find(u => u.email === email)) {
                return res.status(400).json({ message: 'User already exists (Mock)' });
            }

            const newUser = {
                _id: new mongoose.Types.ObjectId(),
                email,
                password: bcrypt.hashSync(password, 10), // Hash it for mock too
                role,
                firstName,
                lastName,
                schoolDetails,
                parentInfo,
                moduleAccess
            };
            MOCK_USERS.push(newUser);

            console.log("[REGISTER SUCCESS] MOCK User Created:", newUser._id);
            return res.status(201).json({
                _id: newUser._id,
                email: newUser.email,
                role: newUser.role,
                token: generateToken(newUser._id as unknown as string, newUser.role),
            });
        }

        // 3. REAL DB LOGIC
        const userExists = await User.findOne({ email });
        if (userExists) {
            console.log("[REGISTER DEBUG] User already exists:", email);
            return res.status(400).json({ message: 'User already exists' });
        }

        console.log("[REGISTER DEBUG] Creating User in MongoDB...");
        const user = await User.create({
            firstName,
            lastName,
            email,
            password,
            role,
            dateOfBirth,
            schoolDetails,
            parentInfo,
            moduleAccess,
            consentStatus: parentInfo ? 'pending' : undefined
        });

        console.log("[REGISTER SUCCESS] MongoDB User Created Successfully:", user._id);

        if (user) {
            res.status(201).json({
                _id: user._id,
                email: user.email,
                role: user.role,
                token: generateToken(user._id as unknown as string, user.role),
            });
        }
    } catch (error: any) {
        console.error("[REGISTER ERROR] Full Error Object:", error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((val: any) => val.message);
            console.error("[REGISTER ERROR] Validation Messages:", messages);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/auth/login
// @desc    Auth user & get token
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(`[AUTH DEBUG] Login attempt for: ${email}`);

    try {
        // 1. HARDCODED ADMIN FALLBACK (FAIL-SAFE)
        // This ensures the admin can ALWAYS log in even if DB is connecting, empty, or failing.
        const isAdminEmail = email === 'admin@ibf.com';
        if (isAdminEmail) {
            console.log("[AUTH DEBUG] Admin email detected, checking fail-safe fallback...");
            const hardcodedHash = bcrypt.hashSync('admin123', 10); // Standardized password
            const isHardcodedMatch = await bcrypt.compare(password, hardcodedHash);

            if (isHardcodedMatch) {
                console.log("[AUTH SUCCESS] Admin authenticated via Fail-Safe Fallback");
                return res.json({
                    _id: "000000000000000000000001", // Special static ID for fail-safe admin
                    email: 'admin@ibf.com',
                    role: 'admin',
                    token: generateToken("000000000000000000000001", 'admin'),
                    isMockMode: true,
                    authSource: 'fail-safe'
                });
            } else {
                console.log("[AUTH FAILED] Admin password mismatch in Fail-Safe check");
            }
        }

        // 2. CHECK DB STATUS & WAIT IF NECESSARY
        const dbStatus = mongoose.connection.readyState;
        console.log(`[AUTH DEBUG] Current DB Status: ${dbStatus} (0=disc, 1=conn, 2=connecting, 3=disconnecting)`);

        if (dbStatus !== 1) {
            console.warn(`[AUTH WARN] DB Status: ${dbStatus}. Searching fallback list.`);
            const mockUser = MOCK_USERS.find(u => u.email === email);
            if (mockUser && await bcrypt.compare(password, mockUser.password)) {
                console.log(`[AUTH SUCCESS] User ${email} authenticated via MOCK_USERS`);
                return res.json({
                    _id: mockUser._id,
                    email: mockUser.email,
                    role: mockUser.role,
                    token: generateToken(mockUser._id as unknown as string, mockUser.role),
                    isMockMode: true,
                    authSource: 'mock'
                });
            }

            // CRITICAL: Prevent hang if DB is completely offline (0) or stuck (2)
            if (dbStatus === 0 || dbStatus === 2) {
                console.error(`[AUTH FAILED] DB ${dbStatus === 0 ? 'Disconnected' : 'Connecting'} and user not in mock list.`);
                return res.status(503).json({
                    message: dbStatus === 0 ? 'Database is currently offline.' : 'Database is warming up, please try again in a moment.',
                    isMockMode: true,
                    availableCredentials: 'admin@ibf.com / admin123'
                });
            }
        }

        // 3. REAL DB LOGIC
        console.log("[AUTH DEBUG] Proceeding to MongoDB lookup...");
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            console.log(`[AUTH FAILED] User not found in MongoDB: ${email}`);
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await user.comparePassword(password);
        console.log(`[AUTH DEBUG] DB User found. Password match: ${isMatch}`);

        if (isMatch) {
            console.log(`[AUTH SUCCESS] User ${email} authenticated via MongoDB`);

            // Gamification: Check Streak (Background)
            gamificationService.checkStreak(user._id as unknown as string).catch(err => {
                console.error('[Gamification Error] Silent failure in streak update:', err);
            });

            return res.json({
                _id: user._id,
                email: user.email,
                role: user.role,
                token: generateToken(user._id as unknown as string, user.role),
                authSource: 'mongodb'
            });
        } else {
            console.log(`[AUTH FAILED] Password mismatch for user: ${email}`);
            return res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error: any) {
        console.error('[AUTH CRITICAL ERROR]', error);
        res.status(500).json({
            message: 'Internal Authentication Error',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

export default router;
