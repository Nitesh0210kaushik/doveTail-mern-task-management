import { Session } from '../models/Session';
import type { SessionMetadata } from '../types/auth.types';

export const sessionRepository = {
  create(userId: string, refreshTokenHash: string, expiresAt: Date, metadata: SessionMetadata) {
    return Session.create({ user: userId, refreshTokenHash, expiresAt, ...metadata });
  },
  findActiveByHash(refreshTokenHash: string) {
    return Session.findOne({ refreshTokenHash, revokedAt: null, expiresAt: { $gt: new Date() } }).select('+refreshTokenHash');
  },
  rotate(sessionId: string, refreshTokenHash: string, expiresAt: Date) {
    return Session.findByIdAndUpdate(sessionId, { refreshTokenHash, expiresAt }, { new: true });
  },
  revokeByHash(refreshTokenHash: string) {
    return Session.findOneAndUpdate({ refreshTokenHash, revokedAt: null }, { revokedAt: new Date() }, { new: true });
  }
};
