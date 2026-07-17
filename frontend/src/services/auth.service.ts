import { axiosClient } from '../config/axios.config';
import { ENDPOINTS } from '../constants/endpoints';
import type { AuthResponse, LoginInput, RegisterInput } from '../features/auth/types/auth.types';

export const registerUser = (input: RegisterInput) =>
  axiosClient.post<AuthResponse>(ENDPOINTS.auth.register, input);

export const loginUser = (input: LoginInput) =>
  axiosClient.post<AuthResponse>(ENDPOINTS.auth.login, input);

export const getCurrentUser = () =>
  axiosClient.get<{ user: AuthResponse['user'] }>(ENDPOINTS.auth.me);

export const logoutUser = () =>
  axiosClient.post(ENDPOINTS.auth.logout);
