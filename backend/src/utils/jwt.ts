import jwt, { type JwtPayload } from 'jsonwebtoken';
import crypto from 'node:crypto';
import { env } from '../config/env';

export const signAccessToken = (userId: string): string =>
  jwt.sign({ userId }, env.jwtSecret, {
    expiresIn: env.jwtAccessExpiresIn as jwt.SignOptions['expiresIn']
  });

export const createRefreshToken = (): string => crypto.randomBytes(64).toString('hex');
export const hashRefreshToken = (token: string): string =>
  crypto.createHash('sha256').update(token).digest('hex');

export const verifyAccessToken = (token: string): string | JwtPayload => jwt.verify(token, env.jwtSecret);

export const getUserIdFromPayload = (payload: string | JwtPayload) => {
  if (typeof payload !== 'object' || typeof payload.userId !== 'string') return null;
  return payload.userId;
};
