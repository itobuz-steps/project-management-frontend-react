import type { JSX } from 'react';
import { Navigate } from 'react-router-dom';

export function AuthRedirect({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem('access_token');

  if (token) {
    return <Navigate to="/for-you" replace />;
  }

  return children;
}
