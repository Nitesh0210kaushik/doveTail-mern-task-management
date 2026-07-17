import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { clientEnv } from './env';
import { ENDPOINTS } from '../constants/endpoints';

export const axiosClient = axios.create({
  baseURL: clientEnv.apiUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

type RetryableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };

axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const request = error.config as RetryableRequestConfig | undefined;
    const isRefreshRequest = request?.url?.includes(ENDPOINTS.auth.refresh);
    const isAuthRequest = request?.url?.includes(ENDPOINTS.auth.login)
      || request?.url?.includes(ENDPOINTS.auth.register);

    if (error.response?.status !== 401 || !request || request._retry || isRefreshRequest || isAuthRequest) {
      return Promise.reject(error);
    }

    request._retry = true;
    try {
      await axiosClient.post(ENDPOINTS.auth.refresh);
      return axiosClient(request);
    } catch {
      try {
        await axiosClient.post(ENDPOINTS.auth.logout);
      } catch {
        // The server may be unreachable, but the client must still leave the protected view.
      }

      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.assign('/login');
      }

      return Promise.reject(error);
    }
  }
);
