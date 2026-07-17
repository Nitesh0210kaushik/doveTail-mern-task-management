import mongoose from 'mongoose';
import { env } from './env';
import { logger } from './logger';

export const connectDatabase = async () => {
  await mongoose.connect(env.mongoUri);
  logger.info('MongoDB connected');
};

export const disconnectDatabase = async () => {
  await mongoose.disconnect();
};
