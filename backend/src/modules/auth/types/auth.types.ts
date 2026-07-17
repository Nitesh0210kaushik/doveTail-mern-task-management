export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SafeUser {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthData {
  user: SafeUser;
}

export interface AuthSessionData extends AuthData {
  accessToken: string;
  refreshToken: string;
}

export interface SessionMetadata {
  userAgent?: string;
  ipAddress?: string;
}
