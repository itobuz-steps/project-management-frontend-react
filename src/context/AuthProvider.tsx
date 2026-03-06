import { useEffect, useState } from 'react';
import type { Role } from '../services/types/user';
import { AuthContext } from './AuthContext';
import userService from '../services/userService';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRole] = useState<Role>('member');

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userInfo = await userService.getUserInfo();
      if (userInfo.result.role === 'superadmin') {
        setRole('superadmin');
      }
    };
    fetchUserInfo();
  }, []);

  return (
    <AuthContext.Provider value={{ role, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};
