import express from 'express';
import { protect, authorize } from '../middleware/auth';
import {
    getAdminStudents,
    getIncubatorApps,
    updateStudentConsent
} from '../controllers/admin.controller';

const router = express.Router();

// Admin Only Routes
router.get('/students', protect, authorize('admin'), getAdminStudents);
router.get('/incubator-apps', protect, authorize('admin'), getIncubatorApps);
router.put('/student-consent/:userId', protect, authorize('admin'), updateStudentConsent);

export default router;
