import type { UserDocument } from '../modules/users/types/user.types.js';

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
    }
  }
}

export {};
