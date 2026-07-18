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

const csrfCookieName = 'task_csrf_token';
const unsafeMethods = new Set(['post', 'put', 'patch', 'delete']);

const getCookieValue = (name: string): string | undefined => {
  const cookie = document.cookie
    .split('; ')
    .find((value) => value.startsWith(`${name}=`));
  return cookie ? decodeURIComponent(cookie.slice(name.length + 1)) : undefined;
};

axiosClient.interceptors.request.use((request) => {
  if (unsafeMethods.has((request.method || 'get').toLowerCase())) {
    const csrfToken = getCookieValue(csrfCookieName);
    if (csrfToken) request.headers.set('X-CSRF-Token', csrfToken);
  }
  return request;
});

type RetryableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };

axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const request = error.config as RetryableRequestConfig | undefined;
    const isRefreshRequest = request?.url?.includes(ENDPOINTS.auth.refresh);
    const isSessionRequest = request?.url?.includes(ENDPOINTS.auth.me);
    const isAuthRequest = request?.url?.includes(ENDPOINTS.auth.login)
      || request?.url?.includes(ENDPOINTS.auth.register);

    if (error.response?.status !== 401 || !request || request._retry || isRefreshRequest || isSessionRequest || isAuthRequest) {
      return Promise.reject(error);
    }

    request._retry = true;
    try {
      await axiosClient.post(ENDPOINTS.auth.refresh);
      return axiosClient(request);
    } catch {
      await axiosClient.post(ENDPOINTS.auth.logout).catch(() => undefined);

      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.assign('/login');
      }

      return Promise.reject(error);
    }
  }
);
