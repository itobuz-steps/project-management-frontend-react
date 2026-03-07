import type { Role } from '../services/types/user';

export type Permission =
  | 'ADD_COLUMN'
  | 'SEND_INVITE'
  | 'DELETE_COLUMN'
  | 'CREATE_PROJECT'
  | 'CREATE_WORKSPACE'
  | 'PROJECT_SETTINGS';

const rolePermissions: Record<Role, Permission[]> = {
  member: [],
  admin: ['ADD_COLUMN', 'SEND_INVITE', 'PROJECT_SETTINGS'],
  superadmin: [
    'ADD_COLUMN',
    'DELETE_COLUMN',
    'SEND_INVITE',
    'CREATE_PROJECT',
    'CREATE_WORKSPACE',
    'PROJECT_SETTINGS',
  ],
};

export const getPermissionsByRole = (role: Role) => rolePermissions[role] ?? [];
