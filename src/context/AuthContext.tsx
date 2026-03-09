// AuthContext.tsx
import { createContext, useContext } from 'react';
import type { Role } from '../services/types/user';

type AuthContextType = {
  role: Role;
  setRole: (role: Role) => void;
  userId: string | null;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext must be used inside AuthProvider');
  }
  return ctx;
};
