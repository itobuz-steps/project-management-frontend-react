export type TaskType = 'bug' | 'feature' | 'task';
export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  _id: string;
  projectId: string;
  title: string;
  description?: string;
  type: TaskType;
  key?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  reporter?: string;
  assignee?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTaskPayload {
  projectId: string;
  title: string;
  description?: string;
  type: TaskType;
  key?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  assignee?: string;
  tags?: string[];
}

export interface UpdateTaskPayload extends Partial<CreateTaskPayload> {
  reporter?: string;
}
