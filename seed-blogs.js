const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const blogSchema = new mongoose.Schema({
  title: String,
  slug: String,
  content: String,
  excerpt: String,
  author: mongoose.Schema.Types.ObjectId,
  authorRole: String,
  category: String,
  status: String,
  views: Number,
}, { timestamps: true });

const Blog = mongoose.model('Blog', blogSchema);
const User = mongoose.model('User', new mongoose.Schema({ role: String }));

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hirehub');
    console.log('Connected to DB');

    const author = await User.findOne({ role: { $in: ['admin', 'employer'] } });
    if (!author) {
      console.error('No admin or employer found to author blogs. Please register one first.');
      process.exit(1);
    }

    const blogs = [
      {
        title: "10 Resume Mistakes to Avoid in 2024",
        slug: "10-resume-mistakes-2024",
        category: "Career Advice",
        excerpt: "Learn how to make your resume stand out to recruiters and applicant tracking systems (ATS) with these 10 simple tips.",
        content: "Detailed content about resume mistakes...",
        author: author._id,
        authorRole: author.role,
        status: 'published',
        views: 120
      },
      {
        title: "How to Ace Your Technical Interview",
        slug: "how-to-ace-technical-interview",
        category: "Interview Tips",
        excerpt: "Preparation is key! Discover the most common technical interview questions and how to answer them with confidence.",
        content: "Detailed content about technical interviews...",
        author: author._id,
        authorRole: author.role,
        status: 'published',
        views: 85
      },
      {
        title: "Negotiating Salary: A Complete Guide",
        slug: "negotiating-salary-guide",
        category: "Salary & Benefits",
        excerpt: "Don't leave money on the table. Our comprehensive guide will teach you the art of salary negotiation.",
        content: "Detailed content about salary negotiation...",
        author: author._id,
        authorRole: author.role,
        status: 'published',
        views: 240
      }
    ];

    await Blog.deleteMany({});
    await Blog.insertMany(blogs);
    console.log('Seeded 3 blogs successfully');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
