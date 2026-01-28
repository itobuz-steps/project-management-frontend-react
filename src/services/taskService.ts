import axios from 'axios';
import { config } from '../config/config';
import type { Task } from '../types/tasks.types';
import { attachInterceptor } from '../utils/attachInterceptor';

const API_URL = `${config.api_base_url}/tasks`;

const api = axios.create({
  baseURL: API_URL,
});

attachInterceptor(api);

interface TaskResponse {
  result: Task;
}

export default async function getTaskById(taskId: string): Promise<Task> {
  const res = await api.get<TaskResponse>(`/${taskId}`);

  return res.data.result;
}

export async function updateTask(
  taskId: string,
  updates: Partial<Task>
): Promise<Task> {
  const res = await api.put<TaskResponse>(`/${taskId}`, updates);

  return res.data.result;
}

export async function getAllTasks(): Promise<Task[]> {
  const res = await api.get<{ result: Task[] }>(`/`);

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