export type AuditLogAction =
  | 'TASK_CREATED'
  | 'TASK_UPDATED'
  | 'STATUS_CHANGED'
  | 'ASSIGNEE_CHANGED'
  | 'COMMENT_ADDED'
  | 'TASK_DELETED'
  | 'PROJECT_UPDATED'
  | 'MEMBER_INVITED'
  | 'MEMBER_ROLE_CHANGED'
  | 'SPRINT_CREATED';

export type AuditLogEntityType =
  | 'task'
  | 'project'
  | 'member'
  | 'sprint'
  | 'comment';

export interface AuditLogActor {
  id: string;
  name: string;
}

export interface AuditLogChange {
  field: string;
  from?: string;
  to?: string;
}

export interface AuditLogEntry {
  id: string;
  projectId: string;
  action: AuditLogAction | string;
  entityType: AuditLogEntityType;
  entityId: string;
  entityLabel: string;
  actor: AuditLogActor;
  message: string;
  createdAt: string;
  changes?: AuditLogChange[];
}

export interface ActivityApiUser {
  _id: string;
  name: string;
}

export interface ActivityApiTask {
  _id: string;
  key?: string;
  title?: string;
}

export interface ActivityApiItem {
  _id: string;
  action: string;
  byUser: ActivityApiUser;
  task?: ActivityApiTask;
  projectName?: string;
  updatedFields?: Record<string, { from?: string; to?: string }>;
  createdAt: string;
}

export interface ProjectActivitiesApiResponse {
  activities: ActivityApiItem[];
  total: number;
  page: number;
  totalPages: number;
}
