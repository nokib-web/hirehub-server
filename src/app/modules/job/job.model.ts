import { Schema, model } from 'mongoose';
import { IJob } from './job.interface';

const jobSchema = new Schema<IJob>(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    companyLogo: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    locationType: {
      type: String,
      enum: ['Remote', 'On-site', 'Hybrid'],
      required: [true, 'Location type is required'],
    },
    type: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'],
      required: [true, 'Job type is required'],
    },
    category: {
      type: String,
      enum: [
        'Technology',
        'Marketing',
        'Design',
        'Finance',
        'Healthcare',
        'Education',
        'Sales',
        'Engineering',
        'HR',
        'Legal',
      ],
      required: [true, 'Category is required'],
    },
    salary: {
      min: {
        type: Number,
        required: [true, 'Minimum salary is required'],
      },
      max: {
        type: Number,
        required: [true, 'Maximum salary is required'],
      },
      currency: {
        type: String,
        default: 'USD',
      },
      period: {
        type: String,
        enum: ['hourly', 'monthly', 'yearly'],
        required: [true, 'Salary period is required'],
      },
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    requirements: {
      type: [String],
      required: [true, 'Requirements are required'],
    },
    responsibilities: {
      type: [String],
      required: [true, 'Responsibilities are required'],
    },
    skills: {
      type: [String],
      required: [true, 'Skills tags are required'],
    },
    benefits: {
      type: [String],
      default: [],
    },
    experience: {
      type: String,
      enum: ['Entry Level', 'Mid Level', 'Senior Level', 'Executive'],
      required: [true, 'Experience level is required'],
    },
    deadline: {
      type: Date,
      required: [true, 'Deadline is required'],
    },
    status: {
      type: String,
      enum: ['active', 'closed', 'draft'],
      default: 'active',
    },
    applicantsCount: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
  },
  {
    timestamps: true,
  }
);

export const Job = model<IJob>('Job', jobSchema);
