import { Types } from 'mongoose';

export interface IBlog {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  author: Types.ObjectId;
  authorRole: 'admin' | 'employer';
  category: 'Career Advice' | 'Interview Tips' | 'Salary & Benefits' | 'Recruitment' | 'Industry News';
  tags?: string[];
  status: 'draft' | 'published';
  views: number;
}
