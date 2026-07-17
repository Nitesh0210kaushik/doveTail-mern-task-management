import type { ParamsDictionary } from 'express-serve-static-core';
import type { Request, Response } from 'express';
import { asyncHandler } from '../../../utils/asyncHandler.js';
import { getCurrentUser, loginUser, registerUser } from '../services/auth.service.js';
import { logoutUser, refreshUserSession } from '../services/auth.service.js';
import { env } from '../../../config/env.js';
import { ApiError } from '../../../utils/ApiError.js';
import type { AuthData, LoginRequest, RegisterRequest, SafeUser } from '../types/auth.types.js';

const setRefreshCookie = (res: Response, refreshToken: string): void => {
  res.cookie(env.refreshCookieName, refreshToken, {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};

export const register = asyncHandler(async (
  req: Request<ParamsDictionary, AuthData, RegisterRequest>,
  res: Response<AuthData>
) => {
  const result = await registerUser(req.body, { userAgent: req.get('user-agent'), ipAddress: req.ip });
  setRefreshCookie(res, result.refreshToken);
  const { refreshToken: _refreshToken, ...response } = result;
  res.status(201).json(response);
});

export const login = asyncHandler(async (
  req: Request<ParamsDictionary, AuthData, LoginRequest>,
  res: Response<AuthData>
) => {
  const result = await loginUser(req.body, { userAgent: req.get('user-agent'), ipAddress: req.ip });
  setRefreshCookie(res, result.refreshToken);
  const { refreshToken: _refreshToken, ...response } = result;
  res.status(200).json(response);
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
  setRefreshCookie(res, result.refreshToken);
  const { refreshToken: _nextRefreshToken, ...response } = result;
  res.status(200).json(response);
});

export const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.[env.refreshCookieName];
  if (refreshToken) await logoutUser(refreshToken);
  res.clearCookie(env.refreshCookieName);
  res.status(204).send();
});
