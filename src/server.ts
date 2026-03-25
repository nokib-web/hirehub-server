import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app';
import { Server } from 'http';

dotenv.config();

let server: Server;

async function bootstrap() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    await mongoose.connect(mongoUri);
    console.log('✔ Connected to MongoDB successfully');

    const port = process.env.PORT || 5000;
    server = app.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('✘ Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

process.on('unhandledRejection', (error: any) => {
  console.log('Unhandled Rejection detected, shutting down server...');
  if (server) {
    server.close(() => {
      console.error(error);
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

process.on('uncaughtException', (error: any) => {
  console.log('Uncaught Exception detected, shutting down server...');
  console.error(error);
  process.exit(1);
});

bootstrap();
