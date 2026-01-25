import express from 'express';
import { protect, authorize } from '../middleware/auth';
import {
    getProjects,
    getProjectById,
    createProject,
    seedCollab,
    getTalentProfiles,
    getTalentById,
    applyToProject
} from '../controllers/collab.controller';

const router = express.Router();

// Public Routes
router.get('/projects', getProjects);
router.get('/projects/:id', getProjectById);
router.get('/talent', getTalentProfiles);
router.get('/talent/:id', getTalentById);

// Protected Routes
router.post('/projects', protect, authorize('founder', 'admin'), createProject);
router.post('/apply', protect, authorize('talent', 'admin'), applyToProject);

// Seed Route
router.post('/seed', seedCollab);

export default router;
