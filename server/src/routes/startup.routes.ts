import express from 'express';
import Startup from '../models/Startup';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// @route   GET /api/startups
// @desc    Get all startups
// @access  Private (Founder only/Admin? For MVP: Founder)
router.get('/', protect, authorize('founder', 'admin'), async (req, res) => {
    try {
        const startups = await Startup.find()
            .populate('founder', 'email')
            .sort({ createdAt: -1 });
        res.json(startups);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/startups
// @desc    Register a startup
// @access  Private (Founder)
router.post('/', protect, authorize('founder'), async (req: any, res) => {
    try {
        const startup = await Startup.create({
            ...req.body,
            founder: req.user.id,
        });
        res.status(201).json(startup);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
});

export default router;
