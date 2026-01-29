import type { Project } from '../../types/project.types';

export type TaskType = 'bug' | 'story' | 'task';
export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  _id: string;
  projectId?: string;
  title: string;
  storyPoint?: number;
  description?: string;
  type: TaskType;
  key?: string;
  status: string;
  priority: string;
  dueDate?: string;
  reporter?: string;
  assignee?: string;
  parentTask?: string;
  subTask?: string[];
  labels?: string[];
  tags?: string[];
  attachments?: FileList | File[];
  createdAt?: string;
  updatedAt?: string;
}

export type SubTask = {
  _id?: string;
  title: string;
  isCompleted?: boolean;
};

export type User = {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
};

export interface TaskPopulated {
  _id: string;
  projectId: Project;
  title: string;
  storyPoint?: number;
  description: string;
  type: TaskType;
  key?: string;
  status: string;
  priority: string;
  dueDate?: string;
  reporter?: User;
  assignee?: User;
  parentTask?: string;
  subTask?: string[];
  labels?: string[];
  attachments?: FileList | File[];
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
  status: string;
  priority: TaskPriority;
  dueDate?: string;
  assignee?: string;
  tags?: string[];
}

export interface UpdateTaskPayload extends Partial<CreateTaskPayload> {
  reporter?: string;
}
