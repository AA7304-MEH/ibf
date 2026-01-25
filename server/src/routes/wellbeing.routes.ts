import express from 'express';
import { protect } from '../middleware/auth';
import WellbeingMetrics from '../models/WellbeingMetrics';

const router = express.Router();

// Helper: Normalize date to start of day
const getStartOfDay = (date = new Date()) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
};

// @route   POST /api/wellbeing/heartbeat
// @desc    Update active screen time (pinged every minute by client)
// @access  Private
router.post('/heartbeat', protect, async (req: any, res) => {
    try {
        const today = getStartOfDay();
        const { minutes = 1 } = req.body; // Default 1 minute increment

        // Find today's record or create it
        let metrics = await WellbeingMetrics.findOne({
            userId: req.user.id,
            date: today
        });

        if (!metrics) {
            metrics = await WellbeingMetrics.create({
                userId: req.user.id,
                date: today,
                screenTimeMinutes: minutes
            });
        } else {
            metrics.screenTimeMinutes += minutes;
            await metrics.save();
        }

        res.json({ screenTimeMinutes: metrics.screenTimeMinutes, breaksTaken: metrics.breaksTaken });
    } catch (error) {
        console.error("Heartbeat Error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/wellbeing/checkin
// @desc    Log mood or energy level
// @access  Private
router.post('/checkin', protect, async (req: any, res) => {
    try {
        const today = getStartOfDay();
        const { moodScore, energyLevel } = req.body;

        const metrics = await WellbeingMetrics.findOneAndUpdate(
            { userId: req.user.id, date: today },
            {
                $set: {
                    ...(moodScore && { moodScore }),
                    ...(energyLevel && { energyLevel })
                }
            },
            { new: true, upsert: true } // Create if not exists
        );

        res.json(metrics);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/wellbeing/focus-session
// @desc    Log a completed focus session
// @access  Private
router.post('/focus-session', protect, async (req: any, res) => {
    try {
        const today = getStartOfDay();
        const { durationMinutes } = req.body;

        const metrics = await WellbeingMetrics.findOneAndUpdate(
            { userId: req.user.id, date: today },
            {
                $inc: {
                    focusSessionsCount: 1,
                    totalFocusMinutes: durationMinutes
                }
            },
            { new: true, upsert: true }
        );

        res.json(metrics);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/wellbeing/stats
// @desc    Get metrics for current week
// @access  Private
router.get('/stats', protect, async (req: any, res) => {
    try {
        // Get last 7 days
        const endDate = getStartOfDay();
        const startDate = new Date(endDate);
        startDate.setDate(startDate.getDate() - 6);

        const stats = await WellbeingMetrics.find({
            userId: req.user.id,
            date: { $gte: startDate, $lte: endDate }
        }).sort({ date: 1 });

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

export default router;
