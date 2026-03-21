import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { AIService } from './ai.service';
import sendResponse from '../../utils/sendResponse';

const chat = catchAsync(async (req: Request, res: Response) => {
  const { message, history } = req.body;
  const reply = await AIService.chat(message, history);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'AI reply fetched successfully',
    data: { reply },
  });
});

const generateJobDescription = catchAsync(async (req: Request, res: Response) => {
  const { title, company, category, type, experience } = req.body;
  const result = await AIService.generateJobDescription({
    title,
    company,
    category,
    type,
    experience,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Job description generated successfully',
    data: result,
  });
});

const improveCoverLetter = catchAsync(async (req: Request, res: Response) => {
  const { coverLetter, jobTitle, company } = req.body;
  const improvedCoverLetter = await AIService.improveCoverLetter({
    coverLetter,
    jobTitle,
    company,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Cover letter improved successfully',
    data: { improvedCoverLetter },
  });
});

const getResumeTips = catchAsync(async (req: Request, res: Response) => {
  const { skills, targetRole, experience } = req.body;
  const tips = await AIService.getResumeTips({
    skills,
    targetRole,
    experience,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Resume tips fetched successfully',
    data: { tips },
  });
});

const generateReviewSummary = catchAsync(async (req: Request, res: Response) => {
  const { companyId } = req.body;
  // In a real app, fetch reviews for this company first
  const reviews = [
    { rating: 5, comment: "Amazing culture and growth opportunities." },
    { rating: 4, comment: "Great benefits but can be high pressure sometimes." }
  ];
  const summary = await AIService.generateReviewSummary(companyId, reviews);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Review summary generated successfully',
    data: summary,
  });
});

export const AIController = {
  chat,
  generateJobDescription,
  improveCoverLetter,
  getResumeTips,
  generateReviewSummary,
};
