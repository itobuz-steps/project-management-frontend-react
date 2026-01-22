// src/services/project.service.ts
import { config } from '../config/config';
import type {
  Project,
  CreateProjectPayload,
  UpdateProjectPayload,
} from './types/projects.types';

const BASE_URL = `${config.api_base_url}/projects`;

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('access_token');

  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/* ---------------- CREATE ---------------- */
export const createProject = async (
  payload: CreateProjectPayload
): Promise<Project> => {
  const res = await fetch(`${BASE_URL}/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error('Failed to create project');
  return res.json();
};

/* ---------------- READ ---------------- */
export const getProjectById = async (projectId: string): Promise<Project> => {
  const res = await fetch(`${BASE_URL}/${projectId}/`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error('Failed to fetch project');
  return res.json();
};

export const getAllProjects = async (): Promise<Project[]> => {
  const res = await fetch(`${BASE_URL}/`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error('Failed to fetch projects');
  return res.json();
};

/* ---------------- UPDATE ---------------- */
export const updateProject = async (
  projectId: string,
  payload: UpdateProjectPayload
): Promise<Project> => {
  const res = await fetch(`${BASE_URL}/${projectId}/`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error('Failed to update project');
  return res.json();
};

/* ---------------- DELETE ---------------- */
export const deleteProject = async (projectId: string): Promise<void> => {
  const res = await fetch(`${BASE_URL}/${projectId}/`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error('Failed to delete project');
};

/* ---------------- USERS BY PROJECT ---------------- */
export const getUsersByProjectId = async (
  projectId: string
): Promise<any[]> => {
  const res = await fetch(`${BASE_URL}/get-user/${projectId}`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error('Failed to fetch project users');
  return res.json();
};
