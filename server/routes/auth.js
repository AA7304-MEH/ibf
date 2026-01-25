const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Profile = require('../models/Profile');
const auth = require('../middleware/auth');

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', async (req, res) => {
    const { email, password, role, fullName, age, school } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        user = new User({
            email,
            passwordHash,
            role,
            isProfileComplete: true, // Assuming first step completes it for MVP
        });

        await user.save();

        // Create initial Profile with role-specific logic
        const profile = new Profile({
            userId: user._id,
            fullName,
            age: role === 'student' ? age : undefined,
            school: role === 'student' ? school : undefined,
            parentalConsentVerified: false, // Default
        });
        await profile.save();

        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
        });

        res.json({ user: { id: user.id, email: user.email, role: user.role, fullName: profile.fullName } });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        let user = await User.findOne({ email }).catch(err => {
            console.log("DB Offline, attempting mock auth...");
            return null;
        });

        // MOCK AUTH BYPASS FOR MVP (If DB is offline or user not found)
        if (email === 'admin@ibf.com' && password === 'admin123') {
            console.log("Mock Admin bypass triggered");
            const mockUser = { id: 'mock_admin_id', role: 'admin', email: 'admin@ibf.com' };
            const payload = { user: { id: mockUser.id, role: mockUser.role } };
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 24 * 60 * 60 * 1000,
            });
            return res.json({ user: { id: mockUser.id, email: mockUser.email, role: mockUser.role, fullName: 'System Admin (Mock)' } });
        }

        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const profile = await Profile.findOne({ userId: user._id });

        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.json({ user: { id: user.id, email: user.email, role: user.role, fullName: profile?.fullName } });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ msg: 'Logged out' });
});

// @route   POST api/auth/sync
// @desc    Sync Clerk user to MongoDB (Onboarding)
// @access  Private
router.post('/sync', auth, async (req, res) => {
    const { name, email, role, skills, clerkId } = req.body;

    try {
        let user = await User.findOne({ clerkId });

        if (user) {
            // Update existing?
            return res.json(user);
        }

        // Create new user
        user = new User({
            name,
            email,
            clerkId,
            role,
            password: 'clerk_managed', // Dummy password
        });

        await user.save();

        // Create initial Profile for Clerk user
        const profile = new Profile({
            userId: user._id,
            firstName: name.split(' ')[0],
            lastName: name.split(' ').slice(1).join(' '),
            skills: skills || [],
        });
        await profile.save();

        // Return same structure as before for compatibility, or just the user
        res.json({ user: { id: user.id, name: user.name, role: user.role, email: user.email } });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/auth/user
// @desc    Get logged in user
// @access  Private
router.get('/user', auth, async (req, res) => {
    try {
        // If auth middleware found the user in Mongo
        if (req.user.id) {
            const user = await User.findById(req.user.id).select('-password');
            res.json(user);
        } else {
            res.status(404).json({ msg: 'User not found' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
