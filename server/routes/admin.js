const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Profile = require('../models/Profile');
const User = require('../models/User');

// Middleware to check for Admin role
const adminOnly = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Access Denied: Admin role required' });
    }
    next();
};

// @route   GET api/admin/incubator-apps
// @desc    Get all incubator applications
// @access  Private (Admin only)
router.get('/incubator-apps', auth, adminOnly, async (req, res) => {
    try {
        const apps = await Profile.find({ incubatorStatus: { $ne: 'none' } });
        res.json(apps);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/admin/students
// @desc    Get all student profiles for consent management
// @access  Private (Admin only)
router.get('/students', auth, adminOnly, async (req, res) => {
    try {
        const studentIds = await User.find({ role: 'student' }).select('_id');
        const profiles = await Profile.find({ userId: { $in: studentIds } });
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   PUT api/admin/student-consent/:userId
// @desc    Update student parental consent
// @access  Private (Admin only)
router.put('/student-consent/:userId', auth, adminOnly, async (req, res) => {
    try {
        const { verified } = req.body;
        let profile = await Profile.findOne({ userId: req.params.userId });
        if (!profile) {
            return res.status(404).json({ msg: 'Profile not found' });
        }

        profile.parentalConsentVerified = verified;
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
