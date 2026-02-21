import express from 'express';
import { protect } from '../middleware/auth';
import { getMyLearningDashboard, getLessonDTO, completeLesson } from '../controllers/learning.controller';

const router = express.Router();

router.get('/dashboard', protect, getMyLearningDashboard);
router.get('/lesson/:moduleId/:lessonId', protect, getLessonDTO);
router.post('/complete', protect, completeLesson);

export default router;
