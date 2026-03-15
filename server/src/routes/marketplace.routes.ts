import express from 'express';
import { protect, authorize } from '../middleware/auth';
import {
    getTasksByModule,
    getTaskDetails,
    startTask,
    submitTask,
    adminCreateTask,
    adminGetTasks,
    adminReviewTaskAttempt
} from '../controllers/marketplace.controller';

const router = express.Router();

// =======================
// USER ROUTES
// =======================
router.get('/tasks/:module', protect, getTasksByModule);
router.get('/task/:taskId', protect, getTaskDetails);
router.post('/task/:taskId/start', protect, startTask);
router.post('/task/:taskId/submit', protect, submitTask);

// =======================
// ADMIN ROUTES
// =======================
// We nest these here for convenience, or they could go in admin.routes.ts
// But since they are marketplace domain, let's keep them here protected by admin role.
router.post('/admin/tasks', protect, authorize('admin', 'founder'), adminCreateTask);
router.get('/admin/tasks', protect, authorize('admin', 'founder'), adminGetTasks);
router.post('/admin/attempts/:attemptId/review', protect, authorize('admin', 'founder'), adminReviewTaskAttempt);

export default router;
