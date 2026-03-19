import { Request, Response } from 'express';
import { ReviewService } from './review.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

const createReview = catchAsync(async (req: Request, res: Response) => {
  const reviewData = { ...req.body, reviewerId: req.user?.id };
  const review = await ReviewService.createReview(reviewData);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Review submitted successfully',
    data: review,
  });
});

const getReviewsForCompany = catchAsync(async (req: Request, res: Response) => {
  const reviews = await ReviewService.getReviewsForCompany(req.params.companyId as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Reviews fetched successfully',
    data: reviews,
  });
});

const getAllReviews = catchAsync(async (req: Request, res: Response) => {
  const reviews = await ReviewService.getAllReviews();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All reviews fetched successfully',
    data: reviews,
  });
});

const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.deleteReview(
    req.params.id as string,
    req.user?.id as string,
    req.user?.role as string
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Review deleted successfully',
    data: null,
  });
});

const verifyReview = catchAsync(async (req: Request, res: Response) => {
  const updatedReview = await ReviewService.verifyReview(req.params.id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Review verification status updated',
    data: updatedReview,
  });
});

export const ReviewController = {
  createReview,
  getReviewsForCompany,
  getAllReviews,
  deleteReview,
  verifyReview,
};
