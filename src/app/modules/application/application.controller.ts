import { Request, Response } from 'express';
import { ApplicationService } from './application.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

const createApplication = catchAsync(async (req: Request, res: Response) => {
  const applicationData = { ...req.body, userId: req.user?.id };
  const application = await ApplicationService.createApplication(applicationData);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Application submitted successfully',
    data: application,
  });
});

const getAllApplications = catchAsync(async (req: Request, res: Response) => {
  const { applications, total, page, limit } = await ApplicationService.getAllApplications(
    req.query,
    req.user as any
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Applications fetched successfully',
    data: applications,
    meta: { page, limit, total },
  });
});

const getSingleApplication = catchAsync(async (req: Request, res: Response) => {
  const application = await ApplicationService.getSingleApplication(
    req.params.id as string,
    req.user as any
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Application fetched successfully',
    data: application,
  });
});

const updateApplicationStatus = catchAsync(async (req: Request, res: Response) => {
  const updatedApplication = await ApplicationService.updateApplicationStatus(
    req.params.id as string,
    req.body,
    req.user?.id as string,
    req.user?.role as string
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Application status updated successfully',
    data: updatedApplication,
  });
});

const deleteApplication = catchAsync(async (req: Request, res: Response) => {
  const result = await ApplicationService.deleteApplication(
    req.params.id as string,
    req.user as any
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Application deleted successfully',
    data: null,
  });
});

export const ApplicationController = {
  createApplication,
  getAllApplications,
  getSingleApplication,
  updateApplicationStatus,
  deleteApplication,
};
