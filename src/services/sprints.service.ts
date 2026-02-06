// src/services/sprint.service.ts
import axios from 'axios';
import type {
  Sprint,
  CreateSprintPayload,
  UpdateSprintPayload,
} from './types/sprints.types';
import { config } from '../config/config';
import { attachInterceptor } from '../utils/attachInterceptor';

const API_URL = `${config.api_base_url}/sprint`;

const api = axios.create({
  baseURL: API_URL,
});

attachInterceptor(api);

/* ---------------- GET ALL SPRINTS ---------------- */
export const getSprints = async (): Promise<Sprint[]> => {
  const res = await api.get<{ result: Sprint[] }>('');
  return res.data.result;
};

/* ---------------- CREATE SPRINT ---------------- */
export const createSprint = async (
  payload: CreateSprintPayload
): Promise<Sprint> => {
  const res = await api.post<{ result: Sprint }>('', payload);
  return res.data.result;
};

/* ---------------- GET SPRINT BY ID ---------------- */
export const getSprintById = async (sprintId: string): Promise<Sprint> => {
  const res = await api.get<{ result: Sprint }>(`/${sprintId}`);
  return res.data.result;
};

/* ---------------- UPDATE SPRINT ---------------- */
export const updateSprint = async (
  sprintId: string,
  payload: UpdateSprintPayload
): Promise<Sprint> => {
  const res = await api.put<{ result: Sprint }>(`/${sprintId}`, payload);
  return res.data.result;
};

/* ---------------- DELETE SPRINT ---------------- */
export const deleteSprint = async (sprintId: string): Promise<void> => {
  await api.delete(`/${sprintId}`);
};

/* ---------------- ADD TASKS TO SPRINT ---------------- */
export const addTasksToSprint = async (
  sprintId: string,
  tasks: string[]
): Promise<Sprint> => {
  const res = await api.patch<{ result: Sprint }>(`/${sprintId}/add-tasks`, {
    tasks,
  });
  return res.data.result;
};

/* ---------------- REMOVE TASK FROM SPRINT ---------------- */
export const removeTaskFromSprint = async (
  sprintId: string,
  taskId: string
): Promise<Sprint> => {
  const res = await api.patch<{ result: Sprint }>(`/${sprintId}/remove-task`, {
    task: taskId,
  });
  return res.data.result;
};
