import { randomBytes, timingSafeEqual } from 'node:crypto';
import type { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { env } from '../config/env';
import { ApiError } from '../utils/ApiError';

const safeMethods = new Set(['GET', 'HEAD', 'OPTIONS']);

const createToken = (): string => randomBytes(32).toString('hex');

const setCsrfCookie = (res: Parameters<RequestHandler>[1], token: string): void => {
  res.cookie(env.csrfCookieName, token, {
    httpOnly: false,
    secure: env.nodeEnv === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const issueCsrfToken: RequestHandler = (req, res, next): void => {
  const token = req.cookies?.[env.csrfCookieName] || createToken();
  if (!req.cookies?.[env.csrfCookieName]) setCsrfCookie(res, token);
  next();
};

export const verifyCsrfToken: RequestHandler = (req, _res, next): void => {
  if (safeMethods.has(req.method)) {
    next();
    return;
  }

  // Non-browser API clients do not send Origin/Referer and use explicit auth.
  const isBrowserRequest = Boolean(req.get('origin') || req.get('referer'));
  if (!isBrowserRequest) {
    next();
    return;
  }

  const cookieToken = req.cookies?.[env.csrfCookieName];
  const headerToken = req.get('x-csrf-token');
  if (!cookieToken || !headerToken) {
    next(new ApiError(StatusCodes.FORBIDDEN, 'CSRF token is required'));
    return;
  }

  const cookieBuffer = Buffer.from(cookieToken);
  const headerBuffer = Buffer.from(headerToken);
  if (cookieBuffer.length !== headerBuffer.length || !timingSafeEqual(cookieBuffer, headerBuffer)) {
    next(new ApiError(StatusCodes.FORBIDDEN, 'Invalid CSRF token'));
    return;
  }

  next();
};
