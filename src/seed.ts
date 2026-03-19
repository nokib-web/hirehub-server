import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './app/modules/auth/auth.model';
import { Job } from './app/modules/job/job.model';
import { Review } from './app/modules/review/review.model';

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
    await Review.deleteMany({});
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
    const jobseeker = createdUsers.find((u) => u.role === 'jobseeker');
    
    if (!employer || !jobseeker) throw new Error('Demo users not found');

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
    ];

    for (const jobData of demoJobs) {
      await Job.create(jobData);
    }
    console.log('✔ Demo jobs seeded successfully');

    const demoReviews = [
      {
        companyName: 'TechFlow Inc',
        companyId: (employer as any)._id,
        reviewerId: (jobseeker as any)._id,
        rating: 5,
        title: 'Excellent Innovation Culture',
        comment: 'Amazing place to work at. The technology stack is modern and management is very supportive. Highly recommended for devs.',
        pros: 'Supportive management, good pay, remote focus',
        cons: 'Rapid pace can be challenging sometimes',
        isVerified: true,
      },
      {
        companyName: 'Creative Studio',
        companyId: (employer as any)._id,
        reviewerId: (jobseeker as any)._id,
        rating: 4,
        title: 'Great Design Environment',
        comment: 'The projects are diverse and interesting. Good work-life balance for designers. The tools provided are top-notch.',
        pros: 'Creative freedom, diverse projects',
        cons: 'Sometimes client deadlines are tight',
        isVerified: true,
      },
      {
        companyName: 'GrowthHQ',
        companyId: (employer as any)._id,
        reviewerId: (jobseeker as any)._id,
        rating: 3,
        title: 'Decent but high pressure',
        comment: 'Good learning opportunities but the sales pressure is high. Office environment is competitive but friendly.',
        pros: 'Learning curve, nice colleagues',
        cons: 'High performance targets',
      },
      {
        companyName: 'DataMind Corp',
        companyId: (employer as any)._id,
        reviewerId: (jobseeker as any)._id,
        rating: 5,
        title: 'A data scientist heaven',
        comment: 'Vast datasets and high-end infrastructure for ML. If you love data, this is the place to be.',
        pros: 'Infrasture, interesting datasets',
        cons: 'None so far',
        isVerified: true,
      },
      {
        companyName: 'CloudBase',
        companyId: (employer as any)._id,
        reviewerId: (jobseeker as any)._id,
        rating: 4,
        title: 'Strictly Remote & Productive',
        comment: 'Best remote environment I have experienced. Very efficient communication protocols and great DevOps tools.',
        pros: 'Remote first, efficient tools',
        cons: 'Limited on-site interaction',
      },
    ];

    for (const reviewData of demoReviews) {
      await Review.create(reviewData);
    }
    console.log('✔ Demo reviews seeded successfully');

    await mongoose.disconnect();
    console.log('✔ Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('✘ Seeding failed:', error);
    process.exit(1);
  }
};

seed();
