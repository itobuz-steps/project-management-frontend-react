import { useEffect, useState } from 'react';
import type { Role } from '../services/types/user';
import { AuthContext } from './AuthContext';
import userService from '../services/userService';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRole] = useState<Role>('member');
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userInfo = await userService.getUserInfo();

      setUserId(userInfo.result._id);

      if (userInfo.result.role === 'superadmin') {
        setRole('superadmin');
      }
    };
    fetchUserInfo();
  }, []);

  return (
    <AuthContext.Provider value={{ role, setRole, userId }}>
      {children}
    </AuthContext.Provider>
  );
};
