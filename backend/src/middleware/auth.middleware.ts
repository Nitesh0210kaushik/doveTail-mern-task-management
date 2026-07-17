import type { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { userRepository } from '../modules/users/repositories/user.repository';
import { env } from '../config/env';
import { ApiError } from '../utils/ApiError';
import { getUserIdFromPayload, verifyAccessToken } from '../utils/jwt';

export const authenticate: RequestHandler = async (req, _res, next): Promise<void> => {
  try {
    const header = req.headers.authorization;
    const accessToken = header?.startsWith('Bearer ')
      ? header.slice(7)
      : req.cookies?.[env.accessCookieName];
    if (!accessToken) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Authentication token is required');
    }

    const payload = verifyAccessToken(accessToken);
    const userId = getUserIdFromPayload(payload);
    if (!userId) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid authentication token');
    const user = await userRepository.findById(userId);
    if (!user) throw new ApiError(StatusCodes.UNAUTHORIZED, 'User account no longer exists');

    req.user = user;
    next();
  } catch (error: unknown) {
    const tokenError = error as { name?: string };
    if (tokenError.name === 'JsonWebTokenError' || tokenError.name === 'TokenExpiredError') {
      return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid or expired authentication token'));
    }
    next(error);
  }
};
