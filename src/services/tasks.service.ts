import type {
  Task,
  CreateTaskPayload,
  UpdateTaskPayload,
} from './types/tasks.types';
import { config } from '../config/config';

const BASE_URL = `${config.api_base_url}/tasks`;

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('access_token');

  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/* ---------------- CREATE TASK ---------------- */
export const createTask = async (payload: CreateTaskPayload): Promise<Task> => {
  const res = await fetch(`${BASE_URL}/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error('Failed to create task');
  return res.json();
};

/* ---------------- GET TASKS (with query) ---------------- */
export const getTasks = async (params: {
  projectId: string;
  searchInput?: string;
}): Promise<Task[]> => {
  const query = new URLSearchParams({
    projectId: params.projectId,
    ...(params.searchInput && { searchInput: params.searchInput }),
  }).toString();

  const res = await fetch(`${BASE_URL}/?${query}`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error('Failed to fetch tasks');
  return res.json();
};

/* ---------------- GET TASK BY ID ---------------- */
export const getTaskById = async (taskId: string): Promise<Task> => {
  const res = await fetch(`${BASE_URL}/${taskId}/`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error('Failed to fetch task');
  return res.json();
};

/* ---------------- UPDATE TASK ---------------- */
export const updateTask = async (
  taskId: string,
  payload: UpdateTaskPayload
): Promise<Task> => {
  const res = await fetch(`${BASE_URL}/${taskId}/`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error('Failed to update task');
  return res.json();
};

/* ---------------- DELETE TASK ---------------- */
export const deleteTask = async (taskId: string): Promise<void> => {
  const res = await fetch(`${BASE_URL}/${taskId}/`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error('Failed to delete task');
};
