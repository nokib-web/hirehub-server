import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './app/modules/auth/auth.model';
import { Job } from './app/modules/job/job.model';

dotenv.config();

const seed = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined');
    }

    await mongoose.connect(mongoUri);
    console.log('✔ Connected to MongoDB for seeding');

    // Clear existing data
    await User.deleteMany({});
    await Job.deleteMany({});
    console.log('✔ Existing data cleared');

    // Create demo users
    const demoUsers = [
      {
        name: 'John Seeker',
        email: 'user@example.com',
        password: '123456',
        role: 'jobseeker',
        headline: 'Full Stack Developer',
        skills: ['React', 'Node.js', 'TypeScript', 'MongoDB'],
      },
      {
        name: 'Tech Corp HR',
        email: 'employer@example.com',
        password: '123456',
        role: 'employer',
        company: 'Tech Corp',
        headline: 'HR Manager',
      },
      {
        name: 'Super Admin',
        email: 'admin@example.com',
        password: '123456',
        role: 'admin',
        headline: 'System Administrator',
      },
    ];

    const createdUsers = [];
    for (const userData of demoUsers) {
      const user = await User.create(userData);
      createdUsers.push(user);
    }
    console.log('✔ Demo users seeded successfully');

    const employer = createdUsers.find((u) => u.role === 'employer');
    if (!employer) throw new Error('Employer not found');

    const demoJobs = [
      {
        title: 'Senior React Developer',
        company: 'TechFlow Inc',
        location: 'Remote',
        locationType: 'Remote',
        type: 'Full-time',
        category: 'Technology',
        salary: { min: 120000, max: 150000, currency: 'USD', period: 'yearly' },
        description: 'Join our core frontend team building high-performance UIs.',
        requirements: ['5+ years of React experience', 'CS Degree preferred'],
        responsibilities: ['Architect frontend modules', 'Mentor juniors'],
        skills: ['React', 'Next.js', 'TypeScript'],
        experience: 'Senior Level',
        deadline: new Date('2026-12-31'),
        isFeatured: true,
        createdBy: (employer as any)._id,
      },
      {
        title: 'UX/UI Designer',
        company: 'Creative Studio',
        location: 'Hybrid',
        locationType: 'Hybrid',
        type: 'Full-time',
        category: 'Design',
        salary: { min: 70000, max: 90000, currency: 'USD', period: 'yearly' },
        description: 'Design elegant solutions for our diverse clients.',
        requirements: ['Portfolio showing branding and UI', 'Figma mastery'],
        responsibilities: ['Create mockups', 'Conduct user tests'],
        skills: ['Figma', 'UI Design', 'Case Studies'],
        experience: 'Mid Level',
        deadline: new Date('2026-11-15'),
        isFeatured: false,
        createdBy: (employer as any)._id,
      },
      {
        title: 'Digital Marketing Manager',
        company: 'GrowthHQ',
        location: 'On-site',
        locationType: 'On-site',
        type: 'Full-time',
        category: 'Marketing',
        salary: { min: 60000, max: 80000, currency: 'USD', period: 'yearly' },
        description: 'Lead our cross-channel digital strategy.',
        requirements: ['Data-driven mindset', 'Email marketing expertise'],
        responsibilities: ['Manage SEO/SEM', 'Run ad campaigns'],
        skills: ['SEO', 'Google Ads', 'Mailchimp'],
        experience: 'Mid Level',
        deadline: new Date('2026-10-30'),
        isFeatured: false,
        createdBy: (employer as any)._id,
      },
      {
        title: 'Data Scientist',
        company: 'DataMind Corp',
        location: 'Remote',
        locationType: 'Remote',
        type: 'Full-time',
        category: 'Technology',
        salary: { min: 130000, max: 160000, currency: 'USD', period: 'yearly' },
        description: 'Unlock insights from vast datasets using ML models.',
        requirements: ['M.Sc in Stats/Data Science', 'Python mastery'],
        responsibilities: ['Train ML models', 'Build data pipelines'],
        skills: ['Python', 'Pandas', 'Scikit-learn', 'SQL'],
        experience: 'Senior Level',
        deadline: new Date('2026-09-20'),
        isFeatured: true,
        createdBy: (employer as any)._id,
      },
      {
        title: 'Financial Analyst',
        company: 'CapitalEdge',
        location: 'On-site',
        locationType: 'On-site',
        type: 'Full-time',
        category: 'Finance',
        salary: { min: 75000, max: 95000, currency: 'USD', period: 'yearly' },
        description: 'Help steer our investments through rigorous analysis.',
        requirements: ['CFA preferred', 'Excel modeling skills'],
        responsibilities: ['Prepare forecasts', 'Analyze market trends'],
        skills: ['Excel', '财务报表', 'Risk Assessment'],
        experience: 'Mid Level',
        deadline: new Date('2026-08-15'),
        isFeatured: false,
        createdBy: (employer as any)._id,
      },
      {
        title: 'DevOps Engineer',
        company: 'CloudBase',
        location: 'Remote',
        locationType: 'Remote',
        type: 'Full-time',
        category: 'Engineering',
        salary: { min: 110000, max: 140000, currency: 'USD', period: 'yearly' },
        description: 'Maintain and scale our AWS cloud infrastructure.',
        requirements: ['AWS certification', 'Kubernetes expertise'],
        responsibilities: ['Build CI/CD pipelines', 'Monitor system health'],
        skills: ['AWS', 'K8s', 'Docker', 'Terraform'],
        experience: 'Mid Level',
        deadline: new Date('2026-07-25'),
        isFeatured: true,
        createdBy: (employer as any)._id,
      },
      {
        title: 'Product Manager',
        company: 'LaunchPad',
        location: 'Hybrid',
        locationType: 'Hybrid',
        type: 'Full-time',
        category: 'Technology',
        salary: { min: 100000, max: 130000, currency: 'USD', period: 'yearly' },
        description: 'Define the roadmap for our next-gen SaaS tools.',
        requirements: ['Strategic thinking', 'Agile project mgmt'],
        responsibilities: ['Prioritize backlog', 'Coordinate with devs'],
        skills: ['Agile', 'Jira', 'Strategic Planning'],
        experience: 'Senior Level',
        deadline: new Date('2026-06-20'),
        isFeatured: true,
        createdBy: (employer as any)._id,
      },
      {
        title: 'HR Manager',
        company: 'PeopleFirst',
        location: 'On-site',
        locationType: 'On-site',
        type: 'Full-time',
        category: 'HR',
        salary: { min: 65000, max: 85000, currency: 'USD', period: 'yearly' },
        description: 'Cultivate a great work culture and manage hiring.',
        requirements: ['SHRM certified', 'Strong people skills'],
        responsibilities: ['Oversee payroll', 'Employee relations'],
        skills: ['Management', 'HRIS', 'Compliance'],
        experience: 'Mid Level',
        deadline: new Date('2026-05-15'),
        isFeatured: false,
        createdBy: (employer as any)._id,
      },
      {
        title: 'Frontend Developer',
        company: 'WebCraft',
        location: 'Remote',
        locationType: 'Remote',
        type: 'Full-time',
        category: 'Technology',
        salary: { min: 80000, max: 100000, currency: 'USD', period: 'yearly' },
        description: 'Craft beautiful pixel-perfect web experiences.',
        requirements: ['Tailwind expert', 'CSS/JS master'],
        responsibilities: ['Implement designs', 'Improve page speed'],
        skills: ['React', 'CSS', 'Tailwind'],
        experience: 'Mid Level',
        deadline: new Date('2026-04-10'),
        isFeatured: false,
        createdBy: (employer as any)._id,
      },
      {
        title: 'Graphic Designer',
        company: 'PixelArts',
        location: 'Freelance',
        locationType: 'Remote',
        type: 'Freelance',
        category: 'Design',
        salary: { min: 40, max: 60, currency: 'USD', period: 'hourly' },
        description: 'Create vibrant visuals for our social media.',
        requirements: ['Adobe suite expertise', 'Vector art master'],
        responsibilities: ['Logos', 'Posters', 'Banners'],
        skills: ['Illustrator', 'Photoshop'],
        experience: 'Entry Level',
        deadline: new Date('2026-03-30'),
        isFeatured: false,
        createdBy: (employer as any)._id,
      },
      {
        title: 'Healthcare Analyst',
        company: 'HealthWise',
        location: 'Hybrid',
        locationType: 'Hybrid',
        type: 'Full-time',
        category: 'Healthcare',
        salary: { min: 70000, max: 90000, currency: 'USD', period: 'yearly' },
        description: 'Analyze patient data to improve outcomes.',
        requirements: ['Health informatics degree', 'SQL proficiency'],
        responsibilities: ['Compliance reports', 'Data visualization'],
        skills: ['Tableau', 'SQL', 'HL7'],
        experience: 'Mid Level',
        deadline: new Date('2026-02-25'),
        isFeatured: false,
        createdBy: (employer as any)._id,
      },
      {
        title: 'Education Coordinator',
        company: 'Global Academy',
        location: 'On-site',
        locationType: 'On-site',
        type: 'Full-time',
        category: 'Education',
        salary: { min: 50000, max: 70000, currency: 'USD', period: 'yearly' },
        description: 'Manage diverse educational programs.',
        requirements: ['Organized', 'LMS experience preferred'],
        responsibilities: ['Student guidance', 'Curriculum management'],
        skills: ['Moodle', 'Student Relations'],
        experience: 'Entry Level',
        deadline: new Date('2026-01-20'),
        isFeatured: false,
        createdBy: (employer as any)._id,
      },
      {
        title: 'Sales Representative',
        company: 'DealDazzle',
        location: 'Remote',
        locationType: 'Remote',
        type: 'Full-time',
        category: 'Sales',
        salary: { min: 50000, max: 120000, currency: 'USD', period: 'yearly' },
        description: 'Close deals for our premium B2B software.',
        requirements: ['B2B experience', 'Persistence'],
        responsibilities: ['Cold calling', 'Closing sales'],
        skills: ['Salesforce', 'CRM', 'negotiation'],
        experience: 'Entry Level',
        deadline: new Date('2026-01-15'),
        isFeatured: true,
        createdBy: (employer as any)._id,
      },
      {
        title: 'Legal Counsel',
        company: 'LawLink',
        location: 'On-site',
        locationType: 'On-site',
        type: 'Full-time',
        category: 'Legal',
        salary: { min: 140000, max: 180000, currency: 'USD', period: 'yearly' },
        description: 'Navigate our corporate legal needs.',
        requirements: ['JD required', 'Corporate law experience'],
        responsibilities: ['Contract review', 'Compliance monitoring'],
        skills: ['Law', 'Risk Assessment', 'Contracts'],
        experience: 'Executive',
        deadline: new Date('2025-12-30'),
        isFeatured: true,
        createdBy: (employer as any)._id,
      },
      {
        title: 'Intern Backend Developer',
        company: 'StarterHub',
        location: 'Remote',
        locationType: 'Remote',
        type: 'Internship',
        category: 'Technology',
        salary: { min: 2000, max: 3000, currency: 'USD', period: 'monthly' },
        description: 'Learn Node.js/Mongoose by helping on production tasks.',
        requirements: ['Students only', 'Passionate about JS'],
        responsibilities: ['Assist in bug fixing', 'Write clean documentation'],
        skills: ['Express', 'JavaScript'],
        experience: 'Entry Level',
        deadline: new Date('2025-12-15'),
        isFeatured: false,
        createdBy: (employer as any)._id,
      },
    ];

    for (const jobData of demoJobs) {
      await Job.create(jobData);
    }
    console.log('✔ Demo jobs seeded successfully');

    await mongoose.disconnect();
    console.log('✔ Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('✘ Seeding failed:', error);
    process.exit(1);
  }
};

seed();
