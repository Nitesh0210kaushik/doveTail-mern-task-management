import type { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { env } from '../config/env';
import { ApiError } from '../utils/ApiError';
import { logger } from '../config/logger';
import { StatusCodes } from 'http-status-codes';

export const notFound = (req: Request, _res: Response, next: NextFunction): void => {
  const error = new ApiError(StatusCodes.NOT_FOUND, `Route not found: ${req.method} ${req.originalUrl}`);
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
  let statusCode = typedError.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  let message = typedError.message || 'Internal server error';
  let details = typedError.details;

  if ((typedError.statusCode || StatusCodes.INTERNAL_SERVER_ERROR) >= 500) {
    logger.error({ error: typedError.stack || typedError.message || error }, 'Unhandled server error');
  }

  if (typedError.code === 11000) {
    statusCode = StatusCodes.CONFLICT;
    message = 'A record with this value already exists';
  }
  if (typedError.name === 'ValidationError' && typedError.errors) {
    statusCode = StatusCodes.BAD_REQUEST;
    message = 'Database validation failed';
    details = Object.values(typedError.errors).map((validationError) => ({
      field: validationError.path,
      message: validationError.message
    }));
  }

  if (message === 'Request validation failed' && Array.isArray(details)) {
    const firstValidationError = details[0];
    return res.status(statusCode).json(firstValidationError || {
      field: 'request',
      message: 'Invalid request'
    });
  }

  const response: { message: string; details?: unknown; stack?: string } = { message };
  if (details) response.details = details;
  if (env.nodeEnv !== 'production' && statusCode >= 500) response.stack = typedError.stack;
  res.status(statusCode).json(response);
};
