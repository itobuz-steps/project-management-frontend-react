// src/services/project.service.ts
import axios from 'axios';
import { config } from '../config/config';
import type { Project } from '../types/project.types';
import type { User } from './types/tasks.types';
import type {
  CreateProjectPayload,
  UpdateProjectPayload,
} from '../types/project.types';
import { attachInterceptor } from '../utils/attachInterceptor';
import type { MemberResponse, ProjectResponse } from './types/project.types';

const API_URL = `${config.api_base_url}/project`;

const api = axios.create({
  baseURL: API_URL,
});

attachInterceptor(api);

export const createProject = async (
  payload: CreateProjectPayload
): Promise<Project> => {
  const res = await api.post<{ result: Project }>('', payload);
  return res.data.result;
};

export const getProjectById = async (projectId: string): Promise<Project> => {
  const res = await api.get<ProjectResponse>(`/${projectId}`);
  return res.data.result;
};

export const getAllProjects = async (): Promise<Project[]> => {
  const res = await api.get<Project[]>('');
  return res.data;
};

export const updateProject = async (
  projectId: string,
  payload: UpdateProjectPayload
): Promise<Project> => {
  const res = await api.put<Project>(`/${projectId}`, payload);
  return res.data;
};

export const deleteProject = async (projectId: string): Promise<void> => {
  await api.delete(`/${projectId}`);
};

export const getProjectMembers = async (projectId: string): Promise<User[]> => {
  const response = await api.get<MemberResponse>(`/${projectId}/get-user`);
  return response.data.result;
};

export const getUsersByProjectId = async (
  projectId: string
): Promise<User[]> => {
  const res = await api.get<User[]>(`/${projectId}/get-user`);
  return res.data;
};

export const deleteProjectColumn = async (
  projectId: string,
  columnName: string
) => {
  const response = await api.delete(
    `/${projectId}/columns/${encodeURIComponent(columnName)}`
  );

  return response.data;
};
