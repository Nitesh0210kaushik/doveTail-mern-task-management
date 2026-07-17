import type { ParamsDictionary } from 'express-serve-static-core';
import type { Request, Response } from 'express';
import { asyncHandler } from '../../../utils/asyncHandler.js';
import { getCurrentUser, loginUser, registerUser } from '../services/auth.service.js';
import { logoutUser, refreshUserSession } from '../services/auth.service.js';
import { env } from '../../../config/env.js';
import { ApiError } from '../../../utils/ApiError.js';
import type { AuthData, AuthSessionData, LoginRequest, RegisterRequest, SafeUser } from '../types/auth.types.js';

const setAuthCookies = (res: Response, accessToken: string, refreshToken: string): void => {
  const cookieOptions = {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: 'lax' as const
  };
  res.cookie(env.accessCookieName, accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
  res.cookie(env.refreshCookieName, refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};

export const register = asyncHandler(async (
  req: Request<ParamsDictionary, AuthSessionData, RegisterRequest>,
  res: Response<AuthData>
) => {
  const result = await registerUser(req.body, { userAgent: req.get('user-agent'), ipAddress: req.ip });
  setAuthCookies(res, result.accessToken, result.refreshToken);
  res.status(201).json({ user: result.user });
});

export const login = asyncHandler(async (
  req: Request<ParamsDictionary, AuthSessionData, LoginRequest>,
  res: Response<AuthData>
) => {
  const result = await loginUser(req.body, { userAgent: req.get('user-agent'), ipAddress: req.ip });
  setAuthCookies(res, result.accessToken, result.refreshToken);
  res.status(200).json({ user: result.user });
});

export const me = asyncHandler(async (
  req: Request,
  res: Response<{ user: SafeUser }>
) => {
  if (!req.user) throw new Error('Authenticated user is missing');
  const user = await getCurrentUser(req.user._id.toString());
  res.status(200).json({ user });
});

export const refresh = asyncHandler(async (req: Request, res: Response<AuthData>) => {
  const refreshToken = req.cookies?.[env.refreshCookieName];
  if (!refreshToken) throw new ApiError(401, 'Refresh token is required');
  const result = await refreshUserSession(refreshToken);
  setAuthCookies(res, result.accessToken, result.refreshToken);
  res.status(200).json({ user: result.user });
});

export const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.[env.refreshCookieName];
  if (refreshToken) await logoutUser(refreshToken);
  res.clearCookie(env.accessCookieName);
  res.clearCookie(env.refreshCookieName);
  res.status(204).send();
});
