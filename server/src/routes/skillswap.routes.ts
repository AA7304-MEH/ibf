import express from 'express';
import { protect, authorize } from '../middleware/auth';
import { moduleAuth } from '../middleware/moduleAuth';
import {
    getInternshipFeed,
    getInternshipById,
    createInternship,
    applyForInternship,
    getMyListings,
    getMyActiveInternships,
    getApplicantsList,
    updateApplicantStatus,
    getCSRImpact,
    seedSkillSwap
} from '../controllers/internship.controller';

const router = express.Router();

// IBF Module: SkillSwap
// Strict module isolation and parental oversight for micro-internships

// Internship Feed & Discovery
router.get('/internships', protect, moduleAuth('skillswap'), getInternshipFeed);
router.get('/internships/:id', protect, moduleAuth('skillswap'), getInternshipById);

// Company Operations
router.post('/internships', protect, authorize('company'), moduleAuth('skillswap'), createInternship);
router.get('/my-listings', protect, authorize('company'), moduleAuth('skillswap'), getMyListings);
router.get('/applicants', protect, authorize('company'), moduleAuth('skillswap'), getApplicantsList);
router.patch('/applicants/:id', protect, authorize('company'), moduleAuth('skillswap'), updateApplicantStatus);
router.get('/csr-impact', protect, authorize('company'), moduleAuth('skillswap'), getCSRImpact);

// Teen Operations
router.post('/internships/:id/apply', protect, authorize('teen', 'student'), moduleAuth('skillswap'), applyForInternship);
router.get('/my-active', protect, authorize('teen', 'student'), moduleAuth('skillswap'), getMyActiveInternships);

// Dev Route
router.post('/seed', seedSkillSwap);

export default router;
