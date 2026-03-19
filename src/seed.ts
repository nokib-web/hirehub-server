import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const seed = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined');
    }

    await mongoose.connect(mongoUri);
    console.log('✔ Connected to MongoDB for seeding');

    // Seeding logic will go here
    console.log('Seeding functionality to be implemented...');

    await mongoose.disconnect();
    console.log('✔ Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('✘ Seeding failed:', error);
    process.exit(1);
  }
};

seed();
