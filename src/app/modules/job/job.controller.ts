import { Request, Response } from 'express';
import { JobService } from './job.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import AppError from '../../utils/AppError';

const createJob = catchAsync(async (req: Request, res: Response) => {
  const jobData = { ...req.body, createdBy: req.user?.id };
  const job = await JobService.createJob(jobData);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Job created successfully',
    data: job,
  });
});

const getAllJobs = catchAsync(async (req: Request, res: Response) => {
  const { jobs, total, page, limit } = await JobService.getAllJobs(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Jobs fetched successfully',
    data: jobs,
    meta: { page, limit, total },
  });
});

const getSingleJob = catchAsync(async (req: Request, res: Response) => {
  const job = await JobService.getSingleJob(req.params.id as string);
  if (!job) {
    throw new AppError(404, 'Job not found');
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Job fetched successfully',
    data: job,
  });
});

const updateJob = catchAsync(async (req: Request, res: Response) => {
  const updatedJob = await JobService.updateJob(
    req.params.id as string,
    req.body,
    req.user?.id as string,
    req.user?.role as string
  );

  if (!updatedJob) {
    throw new AppError(404, 'Job not found');
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Job updated successfully',
    data: updatedJob,
  });
});

const deleteJob = catchAsync(async (req: Request, res: Response) => {
  const result = await JobService.deleteJob(
    req.params.id as string,
    req.user?.id as string,
    req.user?.role as string
  );

  if (!result) {
    throw new AppError(404, 'Job not found');
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Job deleted successfully',
    data: null,
  });
});

export const JobController = {
  createJob,
  getAllJobs,
  getSingleJob,
  updateJob,
  deleteJob,
};
