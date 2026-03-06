import axios from 'axios';
import { config } from '../config/config';
import { attachInterceptor } from '../utils/attachInterceptor';
import type { Project } from '../types/project.types';

const API_URL = `${config.api_base_url}/workspaces`;

const api = axios.create({
  baseURL: API_URL,
});

attachInterceptor(api);

export interface Workspace {
  workspaceName: string;
  workspaceId: string;
  projects: Project[];
}

export async function getWorkspaces() {
  const result = await api.get<{ result: Workspace[] }>('/');
  return result.data;
}

export async function createWorkspace(name: string) {
  const result = await api.post<{ result: Workspace }>('/', { name });
  return result.data;
}

export async function deleteWorkspace(workspaceId: string) {
  const result = await api.delete<{ result: Workspace }>(`/${workspaceId}`);
  return result.data;
}

export async function updateWorkspace(workspaceId: string, name: string) {
  const result = await api.patch<{ result: Workspace }>(`/${workspaceId}`, {
    name,
  });
  return result.data;
}
