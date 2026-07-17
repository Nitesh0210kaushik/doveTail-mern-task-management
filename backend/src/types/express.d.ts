import type { UserDocument } from '../modules/users/types/user.types';

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
    }
  }
}

export {};
