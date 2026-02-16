import type { Task, User } from './tasks.types';

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
  task: Task;
}

export interface UpdatedActivity extends BaseActivity {
  action:
    | 'TASK_UPDATED'
    | 'STATUS_CHANGED'
    | 'COMMENT_ADDED'
    | 'ASSIGNEE_CHANGED';
  task: Task;
  updatedFields: Partial<
    Record<keyof Task, { from: string; to: string } | null>
  >;
}

export interface DeletedActivity extends BaseActivity {
  action: 'TASK_DELETED';
  task: Task;
}

export type Activity = CreatedActivity | UpdatedActivity | DeletedActivity;
