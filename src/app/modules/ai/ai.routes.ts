import express from 'express';
import rateLimit from 'express-rate-limit';
import { AIController } from './ai.controller';

const router = express.Router();

// Rate limiting: 10 requests per minute per IP for all /api/ai/* routes
const aiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests
  message: {
    success: false,
    message: 'Too many AI requests. Please try again after a minute.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(aiRateLimiter);

router.post('/chat', AIController.chat);
router.post('/generate-job-description', AIController.generateJobDescription);
router.post('/improve-cover-letter', AIController.improveCoverLetter);
router.post('/resume-tips', AIController.getResumeTips);
router.post('/review-summary', AIController.generateReviewSummary);

export const AIRoutes = router;
