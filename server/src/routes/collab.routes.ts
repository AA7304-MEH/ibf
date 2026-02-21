import express from 'express';
import { protect, authorize } from '../middleware/auth';
import { moduleAuth } from '../middleware/moduleAuth';
import {
    getProjects,
    getProjectById,
    createProject,
    getTalentProfiles,
    getTalentById,
    applyToProject,
    seedCollab
} from '../controllers/collab.controller';

const router = express.Router();

// IBF Module: Collab
// Strict module isolation for talent marketplace and project matching

// Project Routes
router.get('/projects', protect, moduleAuth('collab'), getProjects);
router.get('/projects/:id', protect, moduleAuth('collab'), getProjectById);
router.post('/projects', protect, authorize('founder'), moduleAuth('collab'), createProject);
router.post('/projects/:id/apply', protect, authorize('talent'), moduleAuth('collab'), applyToProject);

// Talent Directory Routes
router.get('/talent', protect, moduleAuth('collab'), getTalentProfiles);
router.get('/talent/:id', protect, moduleAuth('collab'), getTalentById);

// Dev Route
router.post('/seed', seedCollab);

export default router;
