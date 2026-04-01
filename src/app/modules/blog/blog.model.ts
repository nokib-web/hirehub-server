import { Schema, model } from 'mongoose';
import { IBlog } from './blog.interface';

const blogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    excerpt: { type: String, required: true },
    coverImage: { type: String },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    authorRole: { type: String, enum: ['admin', 'employer'], required: true },
    category: { 
      type: String, 
      enum: ['Career Advice', 'Interview Tips', 'Salary & Benefits', 'Recruitment', 'Industry News'],
      required: true 
    },
    tags: [{ type: String }],
    status: { type: String, enum: ['draft', 'published'], default: 'published' },
    views: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// Slugify title before validation
blogSchema.pre('validate', function(this: any, next: any) {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  }
  next();
});

export const Blog = model<IBlog>('Blog', blogSchema);
