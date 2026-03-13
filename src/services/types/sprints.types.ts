// src/interfaces/sprint.ts

import type { TaskPopulated } from './tasks.types';

export interface Sprint {
  _id: string;
  name: string;
  key: string;
  tasks: string[];
  dueDate: Date;
  endDate?: Date;
  startDate?: Date;
  isStarted: boolean;
  isCompleted: boolean;
  projectId: string;
  createdAt?: string;
  updatedAt?: string;
  storyPoint: number;
}

export interface CreateSprintPayload {
  tasks?: string[];
  dueDate?: string;
  startDate?: string;
  isStarted?: boolean;
  isCompleted?: boolean;
  projectId: string;
  storyPoint: number;
}

export interface UpdateSprintPayload {
  tasks?: string[];
  dueDate?: Date;
  startDate?: Date;
  isStarted?: boolean;
  isCompleted?: boolean;
  endDate?: Date;
}

export interface AddTasks {
  taskIds?: string[];
}

export interface SprintCompletionSummary {
  completed: TaskPopulated[];
  pending: TaskPopulated[];
}
