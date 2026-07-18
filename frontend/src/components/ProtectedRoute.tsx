import { Navigate, Outlet } from 'react-router-dom';
import { useCurrentUser } from '../hooks/auth/useCurrentUser';

export default function ProtectedRoute() {
  const { isLoading, isSuccess } = useCurrentUser();

  if (isLoading) return <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">Loading...</div>;
  return isSuccess ? <Outlet /> : <Navigate to="/login" replace />;
}
