import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AdminService } from './admin.service';

const getAnalytics = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getAnalytics(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Analytics fetched successfully',
    data: result,
  });
});

export const AdminController = {
  getAnalytics,
};
