import express from 'express';
import {
  analyzeResume,
  getAtsReportForResume,
} from '../controllers/atsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/analyze', protect, analyzeResume);
router.get('/:resumeId', protect, getAtsReportForResume);

export default router;
