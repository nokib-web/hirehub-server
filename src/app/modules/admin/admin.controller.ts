import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import AppError from '../../utils/AppError';
import { AdminService } from './admin.service';
import { Job } from '../job/job.model';
import { Application } from '../application/application.model';

const getAnalytics = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getAnalytics(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Analytics fetched successfully',
    data: result,
  });
});

// ─── Job Management ──────────────────────────────────────────────────────────

const getAllJobs = catchAsync(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, search, category, status } = req.query;
  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;

  const filter: Record<string, unknown> = {};
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { company: { $regex: search, $options: 'i' } },
    ];
  }
  if (category && category !== 'All') filter.category = category;
  if (status && status !== 'All') filter.status = status;

  const [jobs, total] = await Promise.all([
    Job.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
    Job.countDocuments(filter),
  ]);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All jobs fetched successfully',
    data: jobs,
    meta: { total, page: pageNum, limit: limitNum },
  });
});

const updateJob = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const job = await Job.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
  if (!job) throw new AppError(404, 'Job not found');

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Job updated successfully',
    data: job,
  });
});

const deleteJob = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const job = await Job.findByIdAndDelete(id);
  if (!job) throw new AppError(404, 'Job not found');

  // Clean up related applications
  await Application.deleteMany({ jobId: id });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Job and related applications deleted successfully',
    data: null,
  });
});

// ─── Application Management ───────────────────────────────────────────────────

const getAllApplications = catchAsync(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, status, search } = req.query;
  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;

  const filter: Record<string, unknown> = {};
  if (status && status !== 'all') filter.status = status;

  let applications = await Application.find(filter)
    .populate('userId', 'name email headline')
    .populate('jobId', 'title company location')
    .sort({ createdAt: -1 })
    .lean() as any[];

  // Normalize field names and apply search
  let normalizedApps = applications.map((app) => ({
    ...app,
    applicant: app.userId,
    job: app.jobId,
  }));

  if (search && typeof search === 'string') {
    const s = search.toLowerCase();
    normalizedApps = normalizedApps.filter(
      (app) =>
        app.applicant?.name?.toLowerCase().includes(s) ||
        app.job?.title?.toLowerCase().includes(s),
    );
  }

  const total = normalizedApps.length;
  const paginated = normalizedApps.slice(skip, skip + limitNum);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All applications fetched successfully',
    data: paginated,
    meta: { total, page: pageNum, limit: limitNum },
  });
});

const updateApplicationStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const app = await Application.findByIdAndUpdate(id, { status }, { new: true });
  if (!app) throw new AppError(404, 'Application not found');

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Application status updated successfully',
    data: app,
  });
});

export const AdminController = {
  getAnalytics,
  getAllJobs,
  updateJob,
  deleteJob,
  getAllApplications,
  updateApplicationStatus,
};
