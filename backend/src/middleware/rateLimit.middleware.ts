import rateLimit from 'express-rate-limit';
import { env } from '../config/env';

const rateLimitResponse = {
  message: 'Too many requests. Please try again later.'
};

export const apiRateLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  limit: env.rateLimitMax,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: rateLimitResponse
});

export const authRateLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  limit: env.authRateLimitMax,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    message: 'Too many authentication attempts. Please try again later.'
  }
});
