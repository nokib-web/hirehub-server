import { Application } from './application.model';
import { IApplication, IApplicationStatus } from './application.interface';
import { Job } from '../job/job.model';
import AppError from '../../utils/AppError';

const createApplication = async (applicationData: IApplication) => {
  const job = await Job.findById(applicationData.jobId);
  if (!job) {
    throw new AppError(404, 'Job not found');
  }

  if (job.status !== 'active') {
    throw new AppError(400, 'This job is no longer active');
  }

  const existingApplication = await Application.findOne({
    jobId: applicationData.jobId,
    userId: applicationData.userId,
  });

  if (existingApplication) {
    throw new AppError(400, 'You have already applied for this job');
  }

  const application = await Application.create(applicationData);
  
  // Increment applicantsCount in Job
  await Job.findByIdAndUpdate(applicationData.jobId, {
    $inc: { applicantsCount: 1 },
  });

  return application;
};

const getAllApplications = async (query: any, user: { id: string; role: string }) => {
  const { status, page = 1, limit = 10 } = query;
  const skip = (Number(page) - 1) * Number(limit);

  const filters: any = {};
  if (status) filters.status = status;

  if (user.role === 'admin') {
    // Admin gets everything
  } else if (user.role === 'employer') {
    // Employer gets applications for their jobs only
    const employerJobs = await Job.find({ createdBy: user.id }).select('_id');
    const jobIds = employerJobs.map((job) => job._id);
    filters.jobId = { $in: jobIds };
  } else if (user.role === 'jobseeker') {
    // Jobseeker gets own applications
    filters.userId = user.id;
  }

  const applications = await Application.find(filters)
    .populate('jobId', 'title company location')
    .populate('userId', 'name email avatar')
    .sort('-appliedAt')
    .skip(skip)
    .limit(Number(limit));

  const total = await Application.countDocuments(filters);

  return { applications, total, page: Number(page), limit: Number(limit) };
};

const getSingleApplication = async (id: string, user: { id: string; role: string }) => {
  const application = await Application.findById(id)
    .populate('jobId', 'title company location createdBy')
    .populate('userId', 'name email avatar');

  if (!application) {
    throw new AppError(404, 'Application not found');
  }

  const job = application.jobId as any;

  // Authorization check
  if (
    user.role === 'admin' ||
    application.userId.toString() === user.id ||
    job.createdBy.toString() === user.id
  ) {
    return application;
  }

  throw new AppError(403, 'Unauthorized to view this application');
};

const updateApplicationStatus = async (
  id: string,
  updateData: { status?: IApplicationStatus; employerNotes?: string },
  userId: string,
  role: string
) => {
  const application = await Application.findById(id).populate('jobId', 'createdBy');
  if (!application) {
    throw new AppError(404, 'Application not found');
  }

  const job = application.jobId as any;

  // Only the employer who posted the job can update status
  if (role !== 'admin' && job.createdBy.toString() !== userId) {
    throw new AppError(403, 'Unauthorized to update this application status');
  }

  const updatedApplication = await Application.findByIdAndUpdate(id, updateData, { new: true });
  return updatedApplication;
};

const deleteApplication = async (id: string, user: { id: string; role: string }) => {
  const application = await Application.findById(id);
  if (!application) {
    throw new AppError(404, 'Application not found');
  }

  if (user.role === 'admin') {
    await Application.findByIdAndDelete(id);
    return { success: true };
  }

  if (user.role === 'jobseeker' && application.userId.toString() === user.id) {
    if (application.status !== 'pending') {
      throw new AppError(400, 'Applications can only be withdrawn if status is pending');
    }
    await Application.findByIdAndDelete(id);
    
    // Decrement applicantsCount in Job
    await Job.findByIdAndUpdate(application.jobId, {
      $inc: { applicantsCount: -1 },
    });
    
    return { success: true };
  }

  throw new AppError(403, 'Unauthorized to delete this application');
};

export const ApplicationService = {
  createApplication,
  getAllApplications,
  getSingleApplication,
  updateApplicationStatus,
  deleteApplication,
};
