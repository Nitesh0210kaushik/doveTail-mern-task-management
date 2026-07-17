import { userRepository } from '../../users/repositories/user.repository.js';
import { ApiError } from '../../../utils/ApiError.js';
import { signAccessToken, createRefreshToken, hashRefreshToken } from '../../../utils/jwt.js';
import { sessionRepository } from '../repositories/session.repository.js';
import type { AuthSessionData, LoginRequest, RegisterRequest, SafeUser, SessionMetadata } from '../types/auth.types.js';
import type { UserDocument } from '../../users/types/user.types.js';

const toSafeUser = (user: UserDocument): SafeUser => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

const createAuthSession = async (user: UserDocument, metadata: SessionMetadata): Promise<AuthSessionData> => {
  const refreshToken = createRefreshToken();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await sessionRepository.create(user._id.toString(), hashRefreshToken(refreshToken), expiresAt, metadata);
  return { user: toSafeUser(user), accessToken: signAccessToken(user._id.toString()), refreshToken };
};

export const registerUser = async (
  { name, email, password }: RegisterRequest,
  metadata: SessionMetadata = {}
): Promise<AuthSessionData> => {
  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = await userRepository.findByEmail(normalizedEmail);
  if (existingUser) throw new ApiError(409, 'An account with this email already exists');

  const user = await userRepository.create({ name, email: normalizedEmail, password });
  return createAuthSession(user, metadata);
};

export const loginUser = async (
  { email, password }: LoginRequest,
  metadata: SessionMetadata = {}
): Promise<AuthSessionData> => {
  const user = await userRepository.findByEmailWithPassword(email.toLowerCase().trim());
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }
  return createAuthSession(user, metadata);
};

export const refreshUserSession = async (refreshToken: string): Promise<AuthSessionData> => {
  const session = await sessionRepository.findActiveByHash(hashRefreshToken(refreshToken));
  if (!session) throw new ApiError(401, 'Invalid or expired refresh token');
  const user = await userRepository.findById(session.user.toString());
  if (!user) throw new ApiError(401, 'User account no longer exists');
  const nextRefreshToken = createRefreshToken();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await sessionRepository.rotate(session._id.toString(), hashRefreshToken(nextRefreshToken), expiresAt);
  return { user: toSafeUser(user), accessToken: signAccessToken(user._id.toString()), refreshToken: nextRefreshToken };
};

export const logoutUser = async (refreshToken: string): Promise<void> => {
  await sessionRepository.revokeByHash(hashRefreshToken(refreshToken));
};

export const getCurrentUser = async (userId: string): Promise<SafeUser> => {
  const user = await userRepository.findById(userId);
  if (!user) throw new ApiError(401, 'User account no longer exists');
  return toSafeUser(user);
};
