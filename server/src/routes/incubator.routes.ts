import express from 'express';
import { protect, authorize } from '../middleware/auth';
import { getStartups, getStartupById, createStartup, seedIncubator } from '../controllers/incubator.controller';

const router = express.Router();

// Public Routes
router.get('/startups', getStartups);
router.get('/startups/:id', getStartupById);

// Dev Route (Seed)
router.post('/seed', seedIncubator);

// Founder Routes
router.post('/apply', protect, authorize('founder'), createStartup);

export default router;
