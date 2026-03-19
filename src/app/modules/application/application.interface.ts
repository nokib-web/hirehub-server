import { Types } from 'mongoose';

export type IApplicationStatus = 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired';

export interface IApplication {
  jobId: Types.ObjectId;
  userId: Types.ObjectId;
  resumeUrl: string;
  coverLetter: string;
  portfolioUrl?: string;
  expectedSalary?: number;
  status: IApplicationStatus;
  employerNotes?: string;
  appliedAt: Date;
}
