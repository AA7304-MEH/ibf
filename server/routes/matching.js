const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Project = require('../models/Project');
const Profile = require('../models/Profile');

// @route   GET api/matching/recommendations
// @desc    Get recommended projects for the logged-in user
// @access  Private
router.get('/recommendations', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ userId: req.user.id });
        if (!profile) return res.status(404).json({ msg: 'Profile not found' });

        const userSkills = profile.skills || [];

        // Basic matching algorithm:
        // 1. Find projects that have at least one skill tag matching the user's skills
        // 2. Filter by project type appropriate for the user role
        let query = { status: 'open' };

        if (req.user.role === 'student') {
            query.projectType = 'skillswap';
        } else {
            query.projectType = 'general';
        }

        // Find projects matching any of the user's skills
        const projects = await Project.find({
            ...query,
            skillsRequired: { $in: userSkills }
        }).populate('postedBy', 'email').limit(10);

        // Calculate match percentage for each project
        const recommended = projects.map(project => {
            const matches = project.skillsRequired.filter(skill => userSkills.includes(skill));
            const matchPercentage = Math.round((matches.length / project.skillsRequired.length) * 100);

            return {
                ...project._doc,
                matchPercentage
            };
        });

        // Sort by highest match percentage
        recommended.sort((a, b) => b.matchPercentage - a.matchPercentage);

        res.json(recommended);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
