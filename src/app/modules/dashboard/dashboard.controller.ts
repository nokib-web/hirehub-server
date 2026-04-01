import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { User } from '../user/user.model';
import { Job } from '../job/job.model';
import { Application } from '../application/application.model';
import { Types } from 'mongoose';

const getStats = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const userId = new Types.ObjectId(user?.id);

  if (user?.role === 'admin') {
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

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Admin dashboard stats fetched successfully',
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
  }

  if (user?.role === 'employer') {
    const employerJobs = await Job.find({ createdBy: userId }).select('_id');
    const jobIds = employerJobs.map(job => job._id);

    const [
      totalJobs,
      activeJobs,
      totalApplications,
      pendingApplications,
      hiredCount,
    ] = await Promise.all([
      Job.countDocuments({ createdBy: userId }),
      Job.countDocuments({ createdBy: userId, status: 'active' }),
      Application.countDocuments({ jobId: { $in: jobIds } }),
      Application.countDocuments({ jobId: { $in: jobIds }, status: 'pending' }),
      Application.countDocuments({ jobId: { $in: jobIds }, status: 'hired' }),
    ]);

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Employer dashboard stats fetched successfully',
      data: {
        totalJobs,
        activeJobs,
        totalApplications,
        pendingApplications,
        hiredCount,
      },
    });
  }

  if (user?.role === 'jobseeker') {
    const [
      totalApplications,
      pendingApplications,
      hiredCount,
      rejectedCount,
    ] = await Promise.all([
      Application.countDocuments({ userId: userId }),
      Application.countDocuments({ userId: userId, status: 'pending' }),
      Application.countDocuments({ userId: userId, status: 'hired' }),
      Application.countDocuments({ userId: userId, status: 'rejected' }),
    ]);

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Jobseeker dashboard stats fetched successfully',
      data: {
        totalApplications,
        pendingApplications,
        hiredCount,
        rejectedCount,
      },
    });
  }
});

const getChartData = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const userId = new Types.ObjectId(user?.id);
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  if (user?.role === 'admin') {
    const [
      monthlyApplications,
      applicationsByStatus,
      jobsByCategory,
      jobsByType,
      userGrowth,
      topCompanies,
    ] = await Promise.all([
      Application.aggregate([
        { $match: { createdAt: { $gte: oneYearAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: '%b %Y', date: '$createdAt' } },
            count: { $sum: 1 },
            sortDate: { $first: '$createdAt' },
          },
        },
        { $sort: { sortDate: 1 } },
        { $project: { _id: 0, month: '$_id', count: 1 } },
      ]),
      Application.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $project: { _id: 0, status: '$_id', count: 1 } },
      ]),
      Job.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $project: { _id: 0, category: '$_id', count: 1 } },
      ]),
      Job.aggregate([
        { $group: { _id: '$type', count: { $sum: 1 } } },
        { $project: { _id: 0, type: '$_id', count: 1 } },
      ]),
      User.aggregate([
        { $match: { createdAt: { $gte: oneYearAgo } } },
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
        { $group: { _id: '$company', applications: { $sum: '$applicantsCount' } } },
        { $sort: { applications: -1 } },
        { $limit: 5 },
        { $project: { _id: 0, company: '$_id', applications: 1 } },
      ]),
    ]);

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Admin chart data fetched successfully',
      data: {
        monthlyApplications,
        applicationsByStatus,
        jobsByCategory,
        jobsByType,
        userGrowth,
        topCompanies,
      },
    });
  }

  if (user?.role === 'employer') {
    const employerJobs = await Job.find({ createdBy: userId }).select('_id');
    const jobIds = employerJobs.map(job => job._id);

    const [
      monthlyApplications,
      applicationsByStatus,
      jobsByCategory,
    ] = await Promise.all([
      Application.aggregate([
        { $match: { jobId: { $in: jobIds }, createdAt: { $gte: oneYearAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: '%b %Y', date: '$createdAt' } },
            count: { $sum: 1 },
            sortDate: { $first: '$createdAt' },
          },
        },
        { $sort: { sortDate: 1 } },
        { $project: { _id: 0, month: '$_id', count: 1 } },
      ]),
      Application.aggregate([
        { $match: { jobId: { $in: jobIds } } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $project: { _id: 0, status: '$_id', count: 1 } },
      ]),
      Job.aggregate([
        { $match: { createdBy: userId } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $project: { _id: 0, category: '$_id', count: 1 } },
      ]),
    ]);

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Employer chart data fetched successfully',
      data: {
        monthlyApplications,
        applicationsByStatus,
        jobsByCategory,
      },
    });
  }

  // Jobseeker Chart Data
  if (user?.role === 'jobseeker') {
     const [
      monthlyApplications,
      applicationsByStatus,
    ] = await Promise.all([
      Application.aggregate([
        { $match: { userId: userId, createdAt: { $gte: oneYearAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: '%b %Y', date: '$createdAt' } },
            count: { $sum: 1 },
            sortDate: { $first: '$createdAt' },
          },
        },
        { $sort: { sortDate: 1 } },
        { $project: { _id: 0, month: '$_id', count: 1 } },
      ]),
      Application.aggregate([
        { $match: { userId: userId } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $project: { _id: 0, status: '$_id', count: 1 } },
      ]),
    ]);

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Jobseeker chart data fetched successfully',
      data: {
        monthlyApplications,
        applicationsByStatus,
      },
    });
  }
});

export const DashboardController = {
  getStats,
  getChartData,
};
