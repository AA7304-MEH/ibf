import express from 'express';
import Project from '../models/Project';
import { protect, authorize } from '../middleware/auth';
import { contentSafety } from '../middleware/safety';
import { calculateMatchScore } from '../services/matching.service';
import User from '../models/User';

const router = express.Router();

// @route   GET /api/projects
// @desc    Get all projects (filtered by type/role)
// @access  Private
router.get('/', protect, async (req: any, res) => {
    try {
        const { type } = req.query;
        let query: any = {};

        // Filter by project type if specified
        if (type) {
            query.projectType = type;
        }

        // Role-based visibility
        // Students can only see SkillSwap projects
        if (req.user.role === 'student') {
            query.projectType = 'skillswap';
        }
        // Talent can see all General projects + SkillSwap if permitted (simplified: verify later)
        if (req.user.role === 'talent') {
            // Defaults to seeing general, can filter.
            // For MVP, talent sees General.
            if (!type) query.projectType = 'general';
        }

        const projects = await Project.find(query)
            .populate('postedBy', 'email role')
            .sort({ createdAt: -1 });

        // Calculate Match Scores if user is a student
        let populatedProjects = projects.map(p => p.toObject());

        if (req.user.role === 'student') {
            const student = await User.findById(req.user.id);
            if (student) {
                // Determine mock profile if fields are empty (for demo purposes if old user)
                const studentProfile = {
                    ...student.toObject(),
                    skills: student.skills?.length ? student.skills : [{ name: 'JavaScript', level: 'intermediate' }], // Fallback for matching demo
                    interests: student.interests?.length ? student.interests : ['Web Dev', 'Startups'] // Fallback
                };

                populatedProjects = populatedProjects.map((p: any) => {
                    const matchData = calculateMatchScore(studentProfile, p as any);
                    return { ...p, matchData };
                });

                // Sort by match score
                populatedProjects.sort((a: any, b: any) => b.matchData.score - a.matchData.score);
            }
        }

        res.json(populatedProjects);
    } catch (error) {
        console.error("Project Fetch Error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/projects
// @desc    Create a project
// @access  Private (Founder, Talent for Collab)
router.post('/', protect, contentSafety, authorize('founder', 'talent', 'student'), async (req: any, res) => {
    try {
        const { title, description, skillsRequired, projectType, duration, estimatedHours, compensation, skillswapDetails } = req.body;

        // Validation: Students can only post SkillSwap
        if (req.user.role === 'student' && projectType !== 'skillswap') {
            return res.status(403).json({ message: 'Students can only post SkillSwap projects' });
        }

        const project = await Project.create({
            title,
            description,
            postedBy: req.user.id,
            skillsRequired,
            projectType,
            duration,
            estimatedHours,
            compensation,
            skillswapDetails
        });

        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
});

export default router;
