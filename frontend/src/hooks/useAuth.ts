import axios from 'axios';
import { useCallback, useState } from 'react';
import { loginUser, logoutUser, registerUser } from '../services/auth.service';
import type { AuthResponse, LoginInput, RegisterInput } from '../features/auth/types/auth.types';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => false
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const authenticate = useCallback(async (request: () => Promise<{ data: AuthResponse }>) => {
    setError('');
    setLoading(true);
    try {
      const response = await request();
      setIsAuthenticated(true);
    } catch (requestError: unknown) {
      const message = axios.isAxiosError<{ message?: string }>(requestError)
        ? requestError.response?.data?.message
        : undefined;
      const nextError = message || 'Something went wrong. Please try again.';
      setError(nextError);
      throw new Error(nextError);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback((input: LoginInput) => authenticate(() => loginUser(input)), [authenticate]);
  const register = useCallback((input: RegisterInput) => authenticate(() => registerUser(input)), [authenticate]);

  const logout = useCallback(async () => {
    await logoutUser();
    setIsAuthenticated(false);
  }, []);

  return { isAuthenticated, loading, error, login, register, logout };
}
