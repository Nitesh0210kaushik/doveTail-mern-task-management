import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { currentUserThunk } from '../../store/auth/authSlice';

export function useCurrentUser() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!auth.checked) void dispatch(currentUserThunk());
  }, [auth.checked, dispatch]);

  return {
    user: auth.user,
    isLoading: !auth.checked || auth.loading,
    isSuccess: auth.checked && Boolean(auth.user),
    isError: auth.checked && !auth.user,
  };
}
