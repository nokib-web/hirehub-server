import { Types } from 'mongoose';

export type ILocationType = 'Remote' | 'On-site' | 'Hybrid';
export type IJobType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Freelance';
export type IJobCategory = 'Technology' | 'Marketing' | 'Design' | 'Finance' | 'Healthcare' | 'Education' | 'Sales' | 'Engineering' | 'HR' | 'Legal';
export type IExperienceLevel = 'Entry Level' | 'Mid Level' | 'Senior Level' | 'Executive';
export type IJobStatus = 'active' | 'closed' | 'draft';

export interface IJob {
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  locationType: ILocationType;
  type: IJobType;
  category: IJobCategory;
  salary: {
    min: number;
    max: number;
    currency: string;
    period: 'hourly' | 'monthly' | 'yearly';
  };
  description: string;
  requirements: string[];
  responsibilities: string[];
  skills: string[];
  benefits?: string[];
  experience: IExperienceLevel;
  deadline: Date;
  status: IJobStatus;
  applicantsCount: number;
  views: number;
  isFeatured: boolean;
  createdBy: Types.ObjectId;
}
