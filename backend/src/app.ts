import cors from 'cors';
import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import authRoutes from './modules/auth/routes/auth.routes.js';
import { errorHandler, notFound } from './middleware/error.middleware.js';
import { logger } from './config/logger.js';

const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev', {
  stream: { write: (message: string) => logger.info(message.trim()) }
}));

app.get('/api/health', (_req, res) => {
  res.status(200).json({ message: 'Task Management API is healthy' });
});
app.use('/api/auth', authRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;
