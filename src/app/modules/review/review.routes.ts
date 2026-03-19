import express from 'express';
import { ReviewController } from './review.controller';
import auth from '../../middlewares/auth.middleware';

const router = express.Router();

router.post('/', auth('jobseeker'), ReviewController.createReview);
router.get('/company/:companyId', ReviewController.getReviewsForCompany);
router.get('/', auth('admin'), ReviewController.getAllReviews);
router.delete('/:id', auth('jobseeker', 'admin'), ReviewController.deleteReview);
router.patch('/:id/verify', auth('admin'), ReviewController.verifyReview);

export const ReviewRoutes = router;
