import express from 'express';
import { protect } from '../middleware/auth';
import gamificationController from '../controllers/gamification.controller';

const router = express.Router();

// Public routes
router.get('/leaderboard', gamificationController.getLeaderboard);
router.get('/badges', gamificationController.getAllBadges);

// Protected routes
router.get('/stats', protect, gamificationController.getUserStats);
router.get('/my-badges', protect, gamificationController.getUserBadges);
router.post('/check-in', protect, gamificationController.dailyCheckIn);

// Admin routes
router.post('/award-xp', protect, gamificationController.awardXP);
router.post('/badges', protect, gamificationController.createBadge);
router.post('/seed-badges', protect, gamificationController.seedBadges);

export default router;
