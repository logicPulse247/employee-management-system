import mongoose from 'mongoose';
import { env } from '../config';
import { logger } from '../utils/logger';

const MAX_RETRIES = 5;
const RETRY_DELAY = 5000;

export const connectDB = async (retries = 0): Promise<void> => {
  try {
    const options: mongoose.ConnectOptions = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      dbName: 'ultraship_employees',
    };

    await mongoose.connect(env.MONGODB_URI, options);
    logger.info('✅ MongoDB connected successfully');

    // Connection event handlers
    mongoose.connection.on('error', err => {
      logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      logger.info(`${signal} received. Closing MongoDB connection...`);
      await mongoose.connection.close();
      logger.info('MongoDB connection closed');
      process.exit(0);
    };

    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  } catch (error) {
    logger.error(`MongoDB connection error (attempt ${retries + 1}/${MAX_RETRIES}):`, error);

    if (retries < MAX_RETRIES - 1) {
      logger.info(`Retrying connection in ${RETRY_DELAY}ms...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return connectDB(retries + 1);
    }

    logger.error('Failed to connect to MongoDB after maximum retries');
    process.exit(1);
  }
};

export default connectDB;
