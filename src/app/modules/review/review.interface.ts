import { Types } from 'mongoose';

export interface IReview {
  companyName: string;
  companyId: Types.ObjectId;
  reviewerId: Types.ObjectId;
  rating: number;
  title: string;
  comment: string;
  pros?: string;
  cons?: string;
  isVerified: boolean;
}
