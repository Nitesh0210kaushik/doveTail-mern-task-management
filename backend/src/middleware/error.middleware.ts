import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import { logger } from '../config/logger.js';

export const notFound = (req: Request, _res: Response, next: NextFunction): void => {
  const error = new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`);
  next(error);
};

export const errorHandler: ErrorRequestHandler = (error: unknown, _req, res, _next) => {
  const typedError = error as {
    statusCode?: number;
    message?: string;
    details?: unknown;
    code?: number;
    name?: string;
    stack?: string;
    errors?: Record<string, mongoose.Error.ValidatorError>;
  };
  let statusCode = typedError.statusCode || 500;
  let message = typedError.message || 'Internal server error';
  let details = typedError.details;

  if ((typedError.statusCode || 500) >= 500) {
    logger.error({ error: typedError.stack || typedError.message || error }, 'Unhandled server error');
  }

  if (typedError.code === 11000) {
    statusCode = 409;
    message = 'A record with this value already exists';
  }
  if (typedError.name === 'ValidationError' && typedError.errors) {
    statusCode = 400;
    message = 'Database validation failed';
    details = Object.values(typedError.errors).map((validationError) => ({
      field: validationError.path,
      message: validationError.message
    }));
  }

  const response: { message: string; details?: unknown; stack?: string } = { message };
  if (details) response.details = details;
  if (env.nodeEnv !== 'production' && statusCode >= 500) response.stack = typedError.stack;
  res.status(statusCode).json(response);
};
import type { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
