const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Application = require('../models/Application');
const Project = require('../models/Project');
const Profile = require('../models/Profile');

// @route   POST api/applications
// @desc    Apply to a project
// @access  Private (Talent/Student only)
router.post('/', auth, async (req, res) => {
    if (req.user.role !== 'talent' && req.user.role !== 'student') {
        return res.status(403).json({ msg: 'Only talent/students can apply to projects' });
    }

    try {
        const { projectId, message } = req.body;

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ msg: 'Project not found' });
        }

        // SkillSwap safeguards
        if (project.projectType === 'skillswap' && req.user.role !== 'student') {
            return res.status(403).json({ msg: 'Only students can apply to SkillSwap projects' });
        }

        if (req.user.role === 'student') {
            const profile = await Profile.findOne({ userId: req.user.id });
            if (!profile || !profile.parentalConsentVerified) {
                return res.status(403).json({ msg: 'Parental consent verification required' });
            }
        }

        // Check for duplicate application
        const existingApp = await Application.findOne({ projectId, applicantId: req.user.id });
        if (existingApp) {
            return res.status(400).json({ msg: 'You have already applied to this project' });
        }

        const newApplication = new Application({
            projectId,
            applicantId: req.user.id,
            message,
        });

        const application = await newApplication.save();
        res.json(application);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/applications/me
// @desc    Get current user's applications
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        const applications = await Application.find({ applicantId: req.user.id })
            .populate('projectId')
            .sort({ appliedAt: -1 });
        res.json(applications);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   PUT api/applications/status/:id
// @desc    Update application status
// @access  Private (Project owner only)
router.put('/status/:id', auth, async (req, res) => {
    try {
        const { status } = req.body;
        if (!['accepted', 'rejected'].includes(status)) {
            return res.status(400).json({ msg: 'Invalid status' });
        }

        const application = await Application.findById(req.params.id).populate('projectId');
        if (!application) {
            return res.status(404).json({ msg: 'Application not found' });
        }

        // Only project owner can update status
        if (application.projectId.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Unauthorized' });
        }

        application.status = status;
        await application.save();
        res.json(application);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
