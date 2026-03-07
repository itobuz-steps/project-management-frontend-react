import type { User } from '../services/types/tasks.types';
export type ProjectMemberRole = 'admin' | 'member';

export interface ProjectResponse {
  result: Project;
  success: boolean;
}

export interface MemberResponse {
  result: User[];
  success: boolean;
}

export interface ProjectMember {
  _id: string;
  user: string; // user ID
  role: ProjectMemberRole;
}

export interface PopulatedProjectMember {
  _id: string;
  user: User;
  role: ProjectMemberRole;
}

export type ProjectType = 'kanban' | 'scrum'; // extend if needed

export interface Project {
  _id: string;
  icon?: string;
  name: string;
  projectType: ProjectType;
  columns: string[];
  members: ProjectMember[];
  memberLead: string; // user ID
  defaultAssignee?: string;
  prefix: string;
  lastKey: number;
  sprintCount: number;
  currentSprint: string | null;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
  theme: string;
}

export interface CreateProjectPayload {
  name: string;
  projectType: ProjectType;
  prefix?: string;
  columns?: string[];
  defaultAssignee?: string;
  icon?: File;
}

export interface UpdateProjectPayload {
  name?: string;
  prefix?: string;
  projectType?: ProjectType;
  columns?: string[];
  defaultAssignee?: string;
  icon?: File;
}
