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
  reporter?: User;
  assignee?: User;
  parentTask?: string;
  subTasks?: string[];
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

export type NotificationPreferences = {
  email: boolean;
  push: boolean;
  inApp: boolean;
};

export type User = {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
  notificationPreferences: NotificationPreferences;
};

export type TaskAttachment = File | string;

export interface TaskReference {
  _id: string;
  title: string;
  key?: string;
  status: string;
  type: TaskType;
}

export interface TaskPopulated {
  _id: string;
  projectId: Project | string;
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
  parentTask?: string | null;
  subTasks?: string[];
  labels?: string[];
  attachments?: TaskAttachment[];
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
  blocks?: TaskReference[];
  blockedBy?: TaskReference[];
  relatesTo?: TaskReference[];
  duplicates?: TaskReference[];
}
export interface TaskStats {
  totalAssignedTasks: number;
  tasksCompletedThisWeek: number;
  storyPointsCompletedThisWeek: number;
  allTasksGroupedByProject: { _id: string; tasks: Task[] }[];
  completedTasksGroupedByProject: { _id: string; tasks: Task[] }[];
  tasksCompletedEachDay: {
    date: string;
    count: number;
  }[];
}

export interface CreateTaskPayload {
  projectId: string;
  title: string;
  description?: string;
  type: TaskType;
  key?: string;
  parentTask?: string;
  status?: string;
  priority?: TaskPriority;
  dueDate?: string;
  assignee?: string;
  tags?: string[];
  attachments?: FileList | File[];
  storyPoint?: string;
}

export interface UpdateTaskPayload extends Partial<CreateTaskPayload> {
  reporter?: string;
}

export interface TaskResponse {
  result: TaskPopulated;
}
