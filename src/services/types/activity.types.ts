import type { TaskPopulated, User } from './tasks.types';

export type ActivityAction =
  | 'TASK_CREATED'
  | 'TASK_UPDATED'
  | 'STATUS_CHANGED'
  | 'COMMENT_ADDED'
  | 'ASSIGNEE_CHANGED'
  | 'TASK_DELETED';

interface BaseActivity {
  action: ActivityAction;
  byUser: User;
  createdAt: Date;
}

export interface CreatedActivity extends BaseActivity {
  action: 'TASK_CREATED';
  task: TaskPopulated;
}

export interface UpdatedActivity extends BaseActivity {
  action:
    | 'TASK_UPDATED'
    | 'STATUS_CHANGED'
    | 'COMMENT_ADDED'
    | 'ASSIGNEE_CHANGED';
  task: TaskPopulated;
  updatedFields: Partial<
    Record<keyof TaskPopulated, { from: string; to: string } | null>
  >;
}

export interface DeletedActivity extends BaseActivity {
  action: 'TASK_DELETED';
  task: TaskPopulated;
}

export type Activity = CreatedActivity | UpdatedActivity | DeletedActivity;
