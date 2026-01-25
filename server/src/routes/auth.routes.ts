import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User';

const router = express.Router();

// Generate Token
const generateToken = (id: string, role: string) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET as string, {
        expiresIn: '30d',
    });
};

// Mock Database for Fallback
const MOCK_USERS: any[] = [];

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

        // CHECK DB STATUS
        const isDbConnected = mongoose.connection.readyState === 1;

        if (!isDbConnected) {
            console.warn("[WARN] DB Not Connected. Using MOCK_USERS fallback.");

            // Mock Validation
            if (MOCK_USERS.find(u => u.email === email)) {
                return res.status(400).json({ message: 'User already exists (Mock)' });
            }

            const newUser = {
                _id: new mongoose.Types.ObjectId(),
                email,
                password, // Note: In mock mode we don't hash to keep it simple, or we could. 
                role,
                firstName,
                lastName,
                schoolDetails,
                parentInfo
            };
            MOCK_USERS.push(newUser);

            console.log("[REGISTER DEBUG] MOCK User Created:", newUser._id);
            return res.status(201).json({
                _id: newUser._id,
                email: newUser.email,
                role: newUser.role,
                token: generateToken(newUser._id as unknown as string, newUser.role),
            });
        }

        // REAL DB LOGIC
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
            consentStatus: parentInfo ? 'pending' : undefined
        });

        console.log("[REGISTER DEBUG] MongoDB User Created Successfully:", user._id);

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
    try {
        const { email, password } = req.body;
        console.log(`[Login Attempt] Email: ${email}`);

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            console.log('[Login Failed] User not found');
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await user.comparePassword(password);
        console.log(`[Login Debug] User found: ${user.email}, Role: ${user.role}, Password Match: ${isMatch}`);

        if (isMatch) {
            console.log('[Login Success] Generating token...');
            res.json({
                _id: user._id,
                email: user.email,
                role: user.role,
                token: generateToken(user._id as unknown as string, user.role),
            });
        } else {
            console.log('[Login Failed] Password mismatch');
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('[Login Error]', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

export default router;
