// src/interfaces/project.ts
export type ProjectType = 'scrum' | 'kanban';

export interface Project {
  _id: string;
  name: string;
  projectType: ProjectType;
  columns: string[];
  memberLead: string;
  tasks: string | string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProjectPayload {
  name: string;
  projectType: ProjectType;
  columns: string[];
  memberLead: string;
  tasks: string | string[];
}

export interface UpdateProjectPayload {
  name?: string;
  projectType?: ProjectType;
  columns?: string[];
}
