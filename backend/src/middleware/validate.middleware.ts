import { validationResult } from 'express-validator';
import { ApiError } from '../utils/ApiError.js';

export const validate: RequestHandler = (req, _res, next): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const details = errors.array().map((error) => ({
      field: 'path' in error ? error.path : 'unknown',
      message: error.msg
    }));
    return next(new ApiError(400, 'Request validation failed', details));
  }
  next();
};
import type { RequestHandler } from 'express';
