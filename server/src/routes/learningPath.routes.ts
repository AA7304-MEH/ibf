import express from 'express';
import { protect } from '../middleware/auth';
import { generateLearningPath, getLearningPath, updateMilestoneStatus } from '../controllers/learningPath.controller';

const router = express.Router();

router.post('/generate', protect, generateLearningPath);
router.get('/current', protect, getLearningPath);
router.put('/:id/milestone', protect, updateMilestoneStatus);

export default router;
