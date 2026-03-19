import { Schema, model } from 'mongoose';
import { IApplication } from './application.interface';

const applicationSchema = new Schema<IApplication>(
  {
    jobId: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Job ID is required'],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    resumeUrl: {
      type: String,
      required: [true, 'Resume URL is required'],
    },
    coverLetter: {
      type: String,
      required: [true, 'Cover letter is required'],
      minlength: [100, 'Cover letter must be at least 100 characters'],
    },
    portfolioUrl: {
      type: String,
      default: '',
    },
    expectedSalary: {
      type: Number,
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'],
      default: 'pending',
    },
    employerNotes: {
      type: String,
      default: '',
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate applications for the same job by the same user
applicationSchema.index({ jobId: 1, userId: 1 }, { unique: true });

export const Application = model<IApplication>('Application', applicationSchema);
