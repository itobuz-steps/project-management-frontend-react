import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router';
import { toast } from 'react-toastify';

export function ProtectedRoute({
  redirectPath = '/login',
  isAuthenticated,
}: {
  redirectPath?: string;
  isAuthenticated: boolean;
}) {
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please log in to access this page.');
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
}
