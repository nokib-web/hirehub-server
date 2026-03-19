import { Review } from './review.model';
import { IReview } from './review.interface';
import AppError from '../../utils/AppError';

const createReview = async (reviewData: IReview) => {
  const review = await Review.create(reviewData);
  return review;
};

const getReviewsForCompany = async (companyId: string) => {
  const reviews = await Review.find({ companyId })
    .populate('reviewerId', 'name avatar')
    .sort('-createdAt');
  return reviews;
};

const getAllReviews = async () => {
  const reviews = await Review.find()
    .populate('reviewerId', 'name avatar')
    .populate('companyId', 'name company companyLogo')
    .sort('-createdAt');
  return reviews;
};

const deleteReview = async (id: string, userId: string, role: string) => {
  const review = await Review.findById(id);
  if (!review) {
    throw new AppError(404, 'Review not found');
  }

  // Only the reviewer or an admin can delete
  if (review.reviewerId.toString() !== userId && role !== 'admin') {
    throw new AppError(403, 'Unauthorized to delete this review');
  }

  await Review.findByIdAndDelete(id);
  return { success: true };
};

const verifyReview = async (id: string) => {
  const review = await Review.findById(id);
  if (!review) {
    throw new AppError(404, 'Review not found');
  }

  review.isVerified = !review.isVerified;
  await review.save();
  return review;
};

export const ReviewService = {
  createReview,
  getReviewsForCompany,
  getAllReviews,
  deleteReview,
  verifyReview,
};
