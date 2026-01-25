const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Profile = require('../models/Profile');
const Project = require('../models/Project');
const Application = require('../models/Application');

// @route   GET api/dashboard
// @desc    Get user dashboard data based on role
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        if (req.user.id === 'mock_admin_id') {
            return res.json({
                user: { id: 'mock_admin_id', email: 'admin@ibf.com', role: 'admin' },
                profile: { fullName: 'System Admin (Mock Mode)' },
                stats: { pendingStartups: 2, totalUsers: 10, totalProjects: 5 }
            });
        }

        const user = await User.findById(req.user.id).select('-passwordHash').catch(err => null);

        if (!user) {
            return res.json({
                user: { id: req.user.id, role: req.user.role },
                profile: { fullName: 'User (DB Missing)' },
                stats: { note: 'Database Connectivity Offline' }
            });
        }

        const profile = await Profile.findOne({ userId: req.user.id }).catch(err => null);

        let dashboardData = {
            user,
            profile: profile || { fullName: 'Profile Unavailable' },
        };

        if (user.role === 'founder') {
            const projects = await Project.find({ postedBy: user.id }).catch(err => []);
            dashboardData.projects = projects;

            const projectIds = projects.map(p => p._id);
            const applicationCount = await Application.countDocuments({ projectId: { $in: projectIds } }).catch(err => 0);
            dashboardData.stats = {
                projectsCount: projects.length,
                pendingApplications: applicationCount,
                incubatorStatus: profile?.incubatorStatus || 'none'
            };
        } else if (user.role === 'talent' || user.role === 'student') {
            const applications = await Application.find({ applicantId: user.id }).populate('projectId').catch(err => []);
            dashboardData.applications = applications;
            dashboardData.stats = {
                applicationsCount: applications.length,
                parentalConsentVerified: profile?.parentalConsentVerified || false
            };
        } else if (user.role === 'admin') {
            const pendingStartups = await Profile.countDocuments({ incubatorStatus: 'applied' }).catch(err => 0);
            const totalUsers = await User.countDocuments().catch(err => 0);
            const totalProjects = await Project.countDocuments().catch(err => 0);
            dashboardData.stats = {
                pendingStartups,
                totalUsers,
                totalProjects
            };
        }

        res.json(dashboardData);
    } catch (err) {
        console.error("Dashboard Error:", err.message);
        res.json({
            user: { id: req.user.id, role: req.user.role },
            profile: { fullName: 'Offline Mode' },
            stats: { note: 'Backend executing in recovery mode' }
        });
    }
});

module.exports = router;
