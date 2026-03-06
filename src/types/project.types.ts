export type ProjectMemberRole = 'admin' | 'member';

export interface ProjectMember {
  _id: string;
  user: string; // user ID
  role: ProjectMemberRole;
}

export type ProjectType = 'kanban' | 'scrum'; // extend if needed

export interface Project {
  _id: string;
  workspaceId: string;
  name: string;
  projectType: ProjectType;
  columns: string[];
  members: ProjectMember[];
  memberLead: string; // user ID
  prefix: string;
  lastKey: number;
  sprintCount: number;
  currentSprint: string | null;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
}

export interface CreateProjectPayload {
  workspaceId: string;
  name: string;
  projectType: ProjectType;
  columns: string[];
  tasks: string | string[];
}

export interface UpdateProjectPayload {
  workspaceId?: string;
  name?: string;
  projectType?: ProjectType;
  columns?: string[];
}
