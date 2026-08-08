import express from 'express';
import {
  getResumes,
  createResume,
  getResumeById,
  updateResume,
  deleteResume,
  duplicateResume,
} from '../controllers/resumeController.js';
import { renderPdf } from '../controllers/pdfController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getResumes);
router.post('/', protect, createResume);
router.post('/render-pdf', protect, renderPdf);
router.get('/:id', protect, getResumeById);
router.put('/:id', protect, updateResume);
router.delete('/:id', protect, deleteResume);
router.post('/:id/duplicate', protect, duplicateResume);

export default router;
