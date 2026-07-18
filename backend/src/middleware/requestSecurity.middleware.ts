import type { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { env } from '../config/env';
import { ApiError } from '../utils/ApiError';

const safeMethods = new Set(['GET', 'HEAD', 'OPTIONS']);

const removeMongoOperators = (value: unknown): void => {
  if (!value || typeof value !== 'object') return;

  const record = value as Record<string, unknown>;
  for (const key of Object.keys(record)) {
    if (key.startsWith('$') || key.includes('.')) {
      delete record[key];
      continue;
    }

    removeMongoOperators(record[key]);
  }
};

const isAllowedOrigin = (value: string): boolean => {
  try {
    return new URL(value).origin === new URL(env.clientUrl).origin;
  } catch {
    return false;
  }
};

export const requestSecurity: RequestHandler = (req, _res, next): void => {
  removeMongoOperators(req.body);
  removeMongoOperators(req.query);
  removeMongoOperators(req.params);

  if (safeMethods.has(req.method)) {
    next();
    return;
  }

  const origin = req.get('origin');
  const referer = req.get('referer');
  const requestOrigin = origin || referer;

  if (requestOrigin && !isAllowedOrigin(requestOrigin)) {
    next(new ApiError(StatusCodes.FORBIDDEN, 'Request origin is not allowed'));
    return;
  }

  next();
};
