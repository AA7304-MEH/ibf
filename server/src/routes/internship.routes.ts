import express from 'express';
import { protect } from '../middleware/auth';
import {
    createInternship,
    getInternshipFeed,
    applyForInternship,
    getApplicants,
    getMyListings,
    updateApplicantStatus,
    parentApproveApplication,
    getMyActiveInternships
} from '../controllers/internship.controller';

const router = express.Router();

// Public parent approval (token-based auth)
router.post('/parent-approve/:applicantId', parentApproveApplication);

// Protected student routes
router.post('/:id/apply', protect, applyForInternship);
router.get('/feed', protect, getInternshipFeed);
router.get('/my-active', protect, getMyActiveInternships);

// Protected company routes
router.post('/', protect, createInternship);
router.get('/applicants', protect, getApplicants);
router.get('/my-listings', protect, getMyListings);
router.patch('/applicants/:applicantId', protect, updateApplicantStatus);

export default router;
