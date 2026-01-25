const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Profile = require('../models/Profile');
const User = require('../models/User');

// @route   POST api/incubator/apply
// @desc    Apply to incubator
// @access  Private (Founder only)
router.post('/apply', auth, async (req, res) => {
    if (req.user.role !== 'founder') {
        return res.status(403).json({ msg: 'Only founders can apply to the incubator' });
    }

    try {
        const { startupName, startupPitch, startupStage, startupWebsite } = req.body;

        let profile = await Profile.findOne({ userId: req.user.id });

        if (!profile) {
            return res.status(404).json({ msg: 'Profile not found' });
        }

        profile.startupName = startupName;
        profile.startupPitch = startupPitch;
        profile.startupStage = startupStage;
        profile.startupWebsite = startupWebsite;
        profile.incubatorStatus = 'applied';

        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/incubator/startups
// @desc    Get accepted startups for directory
// @access  Public
router.get('/startups', async (req, res) => {
    try {
        const acceptedProfiles = await Profile.find({ incubatorStatus: 'accepted' })
            .select('startupName startupPitch startupStage startupWebsite');
        res.json(acceptedProfiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/incubator/status/:userId
// @desc    Update incubator status (Admin only)
// @access  Private (Admin only)
router.put('/status/:userId', auth, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Access denied' });
    }

    try {
        const { status } = req.body;
        if (!['accepted', 'rejected', 'none'].includes(status)) {
            return res.status(400).json({ msg: 'Invalid status' });
        }

        let profile = await Profile.findOne({ userId: req.params.userId });
        if (!profile) {
            return res.status(404).json({ msg: 'Profile not found' });
        }

        profile.incubatorStatus = status;
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
