import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './app/modules/auth/auth.model';

dotenv.config();

const seed = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined');
    }

    await mongoose.connect(mongoUri);
    console.log('✔ Connected to MongoDB for seeding');

    // Clear existing users
    await User.deleteMany({});
    console.log('✔ Existing users cleared');

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

    for (const userData of demoUsers) {
      await User.create(userData);
    }

    console.log('✔ Demo users seeded successfully');

    await mongoose.disconnect();
    console.log('✔ Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('✘ Seeding failed:', error);
    process.exit(1);
  }
};

seed();
