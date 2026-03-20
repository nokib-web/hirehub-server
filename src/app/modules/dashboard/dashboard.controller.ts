import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { User } from '../auth/auth.model';
import { Job } from '../job/job.model';
import { Application } from '../application/application.model';

const getStats = catchAsync(async (req: Request, res: Response) => {
  const [
    totalUsers,
    totalJobseekers,
    totalEmployers,
    totalJobs,
    activeJobs,
    totalApplications,
    pendingApplications,
    hiredCount,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: 'jobseeker' }),
    User.countDocuments({ role: 'employer' }),
    Job.countDocuments(),
    Job.countDocuments({ status: 'active' }),
    Application.countDocuments(),
    Application.countDocuments({ status: 'pending' }),
    Application.countDocuments({ status: 'hired' }),
  ]);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Dashboard stats fetched successfully',
    data: {
      totalUsers,
      totalJobseekers,
      totalEmployers,
      totalJobs,
      activeJobs,
      totalApplications,
      pendingApplications,
      hiredCount,
    },
  });
});

const getChartData = catchAsync(async (req: Request, res: Response) => {
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const [
    monthlyApplications,
    applicationsByStatus,
    jobsByCategory,
    jobsByType,
    userGrowth,
    topCompanies,
  ] = await Promise.all([
    Application.aggregate([
      {
        $match: {
          appliedAt: { $gte: oneYearAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%b %Y', date: '$appliedAt' } },
          count: { $sum: 1 },
          sortDate: { $first: '$appliedAt' },
        },
      },
      { $sort: { sortDate: 1 } },
      { $project: { _id: 0, month: '$_id', count: 1 } },
    ]),
    Application.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
      { $project: { _id: 0, status: '$_id', count: 1 } },
    ]),
    Job.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
      { $project: { _id: 0, category: '$_id', count: 1 } },
    ]),
    Job.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
        },
      },
      { $project: { _id: 0, type: '$_id', count: 1 } },
    ]),
    User.aggregate([
      {
        $match: {
          createdAt: { $gte: oneYearAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%b %Y', date: '$createdAt' } },
          jobseekers: { $sum: { $cond: [{ $eq: ['$role', 'jobseeker'] }, 1, 0] } },
          employers: { $sum: { $cond: [{ $eq: ['$role', 'employer'] }, 1, 0] } },
          sortDate: { $first: '$createdAt' },
        },
      },
      { $sort: { sortDate: 1 } },
      { $project: { _id: 0, month: '$_id', jobseekers: 1, employers: 1 } },
    ]),
    Job.aggregate([
      {
        $group: {
          _id: '$company',
          applications: { $sum: '$applicantsCount' },
        },
      },
      { $sort: { applications: -1 } },
      { $limit: 5 },
      { $project: { _id: 0, company: '$_id', applications: 1 } },
    ]),
  ]);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Dashboard chart data fetched successfully',
    data: {
      monthlyApplications,
      applicationsByStatus,
      jobsByCategory,
      jobsByType,
      userGrowth,
      topCompanies,
    },
  });
});

export const DashboardController = {
  getStats,
  getChartData,
};
