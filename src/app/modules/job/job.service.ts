import { SortOrder } from 'mongoose';
import { IJob } from './job.interface';
import { Job } from './job.model';

const createJob = async (jobData: IJob) => {
  const job = await Job.create(jobData);
  return job;
};

const getAllJobs = async (query: any) => {
  const {
    search,
    category,
    type,
    locationType,
    experience,
    salaryMin,
    salaryMax,
    status = 'active',
    sort = '-createdAt',
    page = 1,
    limit = 10,
    isFeatured,
  } = query;

  const filters: any = { status };

  if (search) {
    const searchStr = search as string;
    filters.$or = [
      { title: { $regex: searchStr, $options: 'i' } },
      { company: { $regex: searchStr, $options: 'i' } },
      { description: { $regex: searchStr, $options: 'i' } },
      { skills: { $regex: searchStr, $options: 'i' } },
    ];
  }

  if (category) filters.category = category as any;
  if (type) filters.type = type as any;
  if (locationType) filters.locationType = locationType as any;
  if (experience) filters.experience = experience as any;
  if (isFeatured) filters.isFeatured = isFeatured === 'true';

  if (salaryMin) filters['salary.min'] = { $gte: Number(salaryMin as any) };
  if (salaryMax) filters['salary.max'] = { $lte: Number(salaryMax as any) };

  const skip = (Number(page) - 1) * Number(limit);

  const jobs = await Job.find(filters)
    .populate('createdBy', 'name email company avatar')
    .sort(sort as string)
    .skip(skip)
    .limit(Number(limit));

  const total = await Job.countDocuments(filters);

  return { jobs, total, page: Number(page), limit: Number(limit) };
};

const getSingleJob = async (id: string) => {
  const job = await Job.findByIdAndUpdate(
    id,
    { $inc: { views: 1 } },
    { new: true }
  ).populate('createdBy', 'name email company avatar');
  return job;
};

const updateJob = async (id: string, updateData: Partial<IJob>, userId: string, role: string) => {
  const job = await Job.findById(id);
  if (!job) return null;

  // Only the creator or an admin can update
  if (job.createdBy.toString() !== userId && role !== 'admin') {
    throw new Error('Not authorized to update this job');
  }

  const updatedJob = await Job.findByIdAndUpdate(id, updateData, { new: true });
  return updatedJob;
};

const deleteJob = async (id: string, userId: string, role: string) => {
  const job = await Job.findById(id);
  if (!job) return null;

  // Only the creator or an admin can delete
  if (job.createdBy.toString() !== userId && role !== 'admin') {
    throw new Error('Not authorized to delete this job');
  }

  await Job.findByIdAndDelete(id);
  return { success: true };
};

export const JobService = {
  createJob,
  getAllJobs,
  getSingleJob,
  updateJob,
  deleteJob,
};
