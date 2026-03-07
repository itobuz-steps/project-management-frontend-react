import type { Role } from '../services/types/user';

// permissions.ts
export type Permission = 'ADD_COLUMN' | 'SEND_INVITE' | 'PROJECT_SETTINGS';

const rolePermissions: Record<Role, Permission[]> = {
  member: [],
  admin: ['ADD_COLUMN', 'SEND_INVITE', 'PROJECT_SETTINGS'],
  superadmin: ['ADD_COLUMN', 'SEND_INVITE', 'PROJECT_SETTINGS'],
};

export const getPermissionsByRole = (role: Role) => rolePermissions[role] ?? [];
