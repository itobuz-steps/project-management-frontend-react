// src/services/sprint.service.ts
import axios from 'axios';
import type {
  Sprint,
  CreateSprintPayload,
  UpdateSprintPayload,
} from './types/sprints.types';
import { config } from '../config/config';
import { attachInterceptor } from '../utils/attachInterceptor';

export const createSprintService = (projectId: string) => {
  const api = axios.create({
    baseURL: `${config.api_base_url}/project/${projectId}/sprint`,
  });

  attachInterceptor(api);

  return {
    getSprints: async (): Promise<Sprint[]> => {
      const res = await api.get<{ result: Sprint[] }>('');
      return res.data.result;
    },

    getSprintById: async (sprintId: string): Promise<Sprint> => {
      const res = await api.get<{ result: Sprint }>(`/${sprintId}`);
      return res.data.result;
    },

    createSprint: async (payload: CreateSprintPayload): Promise<Sprint> => {
      const res = await api.post<{ result: Sprint }>('', payload);
      return res.data.result;
    },

    updateSprint: async (
      sprintId: string,
      payload: UpdateSprintPayload
    ): Promise<Sprint> => {
      const res = await api.put<{ result: Sprint }>(`/${sprintId}`, payload);
      return res.data.result;
    },

    deleteSprint: async (sprintId: string): Promise<void> => {
      await api.delete(`/${sprintId}`);
    },

    addTasksToSprint: async (
      sprintId: string,
      tasks: string[]
    ): Promise<Sprint> => {
      const res = await api.patch<{ result: Sprint }>(
        `/${sprintId}/add-tasks`,
        { tasks }
      );
      return res.data.result;
    },

    removeTaskFromSprint: async (
      sprintId: string,
      taskId: string
    ): Promise<Sprint> => {
      const res = await api.patch<{ result: Sprint }>(
        `/${sprintId}/remove-task`,
        { task: taskId }
      );
      return res.data.result;
    },
  };
};
