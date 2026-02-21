import express from 'express';
import { calculateEquity, calculateCultureMatch, predictValue } from '../controllers/symbiosis.controller';
import { protect } from '../middleware/auth';

const router = express.Router();

// Public for now (or protect if needed), let's protect to simulate real user data usage
router.post('/equity', protect, calculateEquity);
router.post('/culture', protect, calculateCultureMatch);
router.post('/value', protect, predictValue);

export default router;
