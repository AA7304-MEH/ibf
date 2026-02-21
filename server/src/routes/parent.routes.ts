import express from 'express';
import { protect } from '../middleware/auth';
import { getChildren, getPendingApprovals, processApproval } from '../controllers/parent.controller';

const router = express.Router();

router.get('/children', protect, getChildren);
router.get('/approvals', protect, getPendingApprovals);
router.post('/approve', protect, processApproval);

export default router;
