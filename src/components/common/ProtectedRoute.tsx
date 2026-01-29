import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { toast } from 'react-toastify';

export function ProtectedRoute({
  redirectPath = '/login',
}: {
  redirectPath?: string;
}) {
  const location = useLocation();

  useEffect(() => {
    if (localStorage.getItem('access_token') === null) {
      toast.error('Please log in to access this page.');
    }
  }, []);

  if (localStorage.getItem('access_token') === null) {
    return (
      <Navigate to={redirectPath} state={{ from: location.pathname }} replace />
    );
  }

  return <Outlet />;
}
