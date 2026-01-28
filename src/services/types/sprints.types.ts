// src/interfaces/sprint.ts
export interface Sprint {
  _id: string;
  name: string;
  key: string;
  tasks: string[];
  dueDate: string;
  isCompleted: boolean;
  projectId: string;
  createdAt?: string;
  updatedAt?: string;
  storyPoint: number;
}

export interface CreateSprintPayload {
  name: string;
  key: string;
  tasks: string[];
  dueDate: string;
  isCompleted: boolean;
  projectId: string;
}

export interface UpdateSprintPayload {
  name?: string;
  key?: string;
  tasks?: string[];
  dueDate?: string;
  isCompleted?: boolean;
}

export interface AddTasks {
  taskIds?: string[];
}
