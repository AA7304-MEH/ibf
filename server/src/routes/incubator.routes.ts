import express from 'express';
import { protect, authorize } from '../middleware/auth';
import { moduleAuth } from '../middleware/moduleAuth';
import { getStartups, getStartupById, createStartup, seedIncubator, getFounderCopilotAdvice } from '../controllers/incubator.controller';

const router = express.Router();

// IBF Module: Incubator
// Apply strict module isolation to all incubator routes

// Public discovery (within the module UI)
router.get('/startups', protect, moduleAuth('incubator'), getStartups);
router.get('/startups/:id', protect, moduleAuth('incubator'), getStartupById);

// Dev Route (Seed)
router.post('/seed', seedIncubator);

// Founder Routes - Application
router.post('/apply', protect, authorize('founder'), moduleAuth('incubator'), createStartup);

// AI Founder Copilot
router.post('/copilot', protect, authorize('founder'), moduleAuth('incubator'), getFounderCopilotAdvice);

export default router;
