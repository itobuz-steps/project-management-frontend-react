import type { Role } from '../services/types/user';

// permissions.ts
export type Permission = 'ADD_COLUMN' | 'DELETE_COLUMN' | 'SEND_INVITE';

const rolePermissions: Record<Role, Permission[]> = {
  member: [],
  admin: ['ADD_COLUMN', 'DELETE_COLUMN', 'SEND_INVITE'],
  superadmin: ['ADD_COLUMN', 'DELETE_COLUMN', 'SEND_INVITE'],
};

export const getPermissionsByRole = (role: Role) => rolePermissions[role] ?? [];
