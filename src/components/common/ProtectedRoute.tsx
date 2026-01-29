import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router';
import { toast } from 'react-toastify';

export function ProtectedRoute({
  redirectPath = '/login',
}: {
  redirectPath?: string;
}) {
  useEffect(() => {
    if (localStorage.getItem('access_token') === null) {
      toast.error('Please log in to access this page.');
    }
  }, []);

  if (localStorage.getItem('access_token') === null) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
}
