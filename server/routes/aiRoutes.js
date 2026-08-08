import express from 'express';
import {
  generateSummary,
  improveBullet,
  rewriteExperience,
  generateProjectDesc,
} from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/summary', protect, generateSummary);
router.post('/improve-bullet', protect, improveBullet);
router.post('/rewrite-experience', protect, rewriteExperience);
router.post('/project-description', protect, generateProjectDesc);

export default router;
