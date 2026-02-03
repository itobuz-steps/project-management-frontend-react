import axios from 'axios';
import { config } from '../config/config';
import type {
  CreateTaskPayload,
  Task,
  TaskPopulated,
  TaskResponse,
} from '../services/types/tasks.types';
import { attachInterceptor } from '../utils/attachInterceptor';
import { mapObjectToFormData } from '../utils/mapObjectToFormdata';

const API_URL = `${config.api_base_url}/tasks`;

const api = axios.create({
  baseURL: API_URL,
});

attachInterceptor(api);

export async function createTask(task: CreateTaskPayload) {
  const response = await api.post(
    `/`,
    mapObjectToFormData(task as unknown as Record<string, unknown>)
  );

  return response.data.result;
}

export default async function getTaskById(
  taskId: string
): Promise<TaskPopulated> {
  const res = await api.get<TaskResponse>(`/${taskId}`);

  return res.data.result;
}

export async function updateTask(
  taskId: string,
  updates: Partial<TaskPopulated> | Partial<Task>
): Promise<TaskPopulated> {
  const res = await api.put<TaskResponse>(`/${taskId}`, updates);

  return res.data.result;
}

export async function getAllTasks(): Promise<TaskPopulated[]> {
  const res = await api.get<{ result: TaskPopulated[] }>(`/`);

  return res.data.result;
}

export async function getTaskByProjectId(
  projectId: string,
  filter: string | null = '',
  searchInput: string | null = ''
) {
  const response = await api.get(
    `/?projectId=${projectId}&filter=${filter}&searchInput=${searchInput}`
  );

  return response.data.result;
}

export async function deleteTask(taskId: string): Promise<void> {
  await api.delete(`/${taskId}`);
}

export async function getUserTasks(): Promise<TaskPopulated[]> {
  const res = await api.get<{ result: TaskPopulated[] }>(`/me`);
  return res.data.result;
}

export async function getTasks(params: {
  projectId: string;
  searchInput?: string;
}): Promise<Task[]> {
  const res = await api.get<{ result: Task[] }>(`/`, {
    params,
  });

  return res.data.result;
}
