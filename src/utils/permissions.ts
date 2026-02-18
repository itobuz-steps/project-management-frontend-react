import type { Role } from '../services/types/user';

// permissions.ts
export type Permission = 'ADD_COLUMN';

const rolePermissions: Record<Role, Permission[]> = {
  member: [],
  admin: ['ADD_COLUMN'],
  superadmin: ['ADD_COLUMN'],
};

export const getPermissionsByRole = (role: Role) => rolePermissions[role] ?? [];
