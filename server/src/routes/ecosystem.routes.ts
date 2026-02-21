import express from 'express';
import { ecosystemService } from '../services/ecosystem.service';
import { protect } from '../middleware/auth';

const router = express.Router();

// GET /api/ecosystem/stats
// Public or Protected? Protected seems safer for "Brain" data
router.get('/stats', protect, async (req, res) => {
    try {
        const stats = await ecosystemService.getGlobalStats();
        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Ecosystem stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve ecosystem intelligence'
        });
    }
});

export default router;
