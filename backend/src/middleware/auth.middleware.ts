import { userRepository } from '../modules/users/repositories/user.repository.js';
import { ApiError } from '../utils/ApiError.js';
import { getUserIdFromPayload, verifyAccessToken } from '../utils/jwt.js';

export const authenticate: RequestHandler = async (req, _res, next): Promise<void> => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      throw new ApiError(401, 'Authentication token is required');
    }

    const payload = verifyAccessToken(header.slice(7));
    const userId = getUserIdFromPayload(payload);
    if (!userId) throw new ApiError(401, 'Invalid authentication token');
    const user = await userRepository.findById(userId);
    if (!user) throw new ApiError(401, 'User account no longer exists');

    req.user = user;
    next();
  } catch (error: unknown) {
    const tokenError = error as { name?: string };
    if (tokenError.name === 'JsonWebTokenError' || tokenError.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'Invalid or expired authentication token'));
    }
    next(error);
  }
};
import type { RequestHandler } from 'express';
