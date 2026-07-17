import { User } from '../models/User';
import type { UserDocument } from '../types/user.types';

export const userRepository = {
  findByEmail(email: string): Promise<UserDocument | null> {
    return User.findOne({ email });
  },

  findByEmailWithPassword(email: string): Promise<UserDocument | null> {
    return User.findOne({ email }).select('+password');
  },

  create(data: { name: string; email: string; password: string }): Promise<UserDocument> {
    return User.create(data);
  },

  findById(userId: string): Promise<UserDocument | null> {
    return User.findById(userId);
  }
};
