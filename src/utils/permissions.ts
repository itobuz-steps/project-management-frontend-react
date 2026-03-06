import type { Role } from '../services/types/user';

// permissions.ts
export type Permission =
  | 'ADD_COLUMN'
  | 'SEND_INVITE'
  | 'CREATE_PROJECT'
  | 'CREATE_WORKSPACE';

const rolePermissions: Record<Role, Permission[]> = {
  member: [],
  admin: ['ADD_COLUMN', 'SEND_INVITE'],
  superadmin: [
    'ADD_COLUMN',
    'SEND_INVITE',
    'CREATE_PROJECT',
    'CREATE_WORKSPACE',
  ],
};

export const getPermissionsByRole = (role: Role) => rolePermissions[role] ?? [];
