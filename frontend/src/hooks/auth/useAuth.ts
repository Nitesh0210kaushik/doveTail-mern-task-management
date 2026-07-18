import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginThunk, logoutThunk, registerThunk } from '../../store/auth/authSlice';

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, loading, error } = useAppSelector((state) => state.auth);

  return {
    isAuthenticated: Boolean(user),
    loading,
    error,
    login: (input: Parameters<typeof loginThunk>[0]) => dispatch(loginThunk(input)).unwrap(),
    register: (input: Parameters<typeof registerThunk>[0]) => dispatch(registerThunk(input)).unwrap(),
    logout: () => dispatch(logoutThunk()).unwrap(),
  };
}
