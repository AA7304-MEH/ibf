const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Project = require('../models/Project');
const User = require('../models/User');
const Profile = require('../models/Profile');

// @route   POST api/projects
// @desc    Create a project
// @access  Private (Founder only)
router.post('/', auth, async (req, res) => {
    if (req.user.role !== 'founder') {
        return res.status(403).json({ msg: 'Only founders can post projects' });
    }

    try {
        const { title, description, skillsRequired, projectType, duration } = req.body;

        const newProject = new Project({
            title,
            description,
            skillsRequired,
            projectType,
            duration,
            postedBy: req.user.id,
        });

        const project = await newProject.save();
        res.json(project);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/projects
// @desc    Get all general open projects
// @access  Public
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find({ projectType: 'general', status: 'open' })
            .populate('postedBy', 'email')
            .sort({ createdAt: -1 });

        // Add logic to get names from profiles if possible, but keep simple for MVP
        res.json(projects);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/projects/skillswap
// @desc    Get SkillSwap projects (Restricted)
// @access  Private (Student with verified consent)
router.get('/skillswap', auth, async (req, res) => {
    try {
        if (req.user.role !== 'student' && req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Access denied: Only students can access SkillSwap projects' });
        }

        // Check consent for students
        if (req.user.role === 'student') {
            const profile = await Profile.findOne({ userId: req.user.id });
            if (!profile || !profile.parentalConsentVerified) {
                return res.status(403).json({ msg: 'Parental consent verification required' });
            }
        }

        const projects = await Project.find({ projectType: 'skillswap', status: 'open' })
            .populate('postedBy', 'email')
            .sort({ createdAt: -1 });

        res.json(projects);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
