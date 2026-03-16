import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { TaskPopulated } from '../services/types/tasks.types';
import getTaskById from '../services/taskService';
import { message } from 'antd';
import { AxiosError } from 'axios';

export function useTask(taskId?: string | null) {
  const queryClient = useQueryClient();

  const taskQuery = useQuery({
    queryKey: ['task', taskId],
    queryFn: () => getTaskById(taskId as string),
    enabled: !!taskId,
  });

  const task = taskQuery.data ?? null;
  const loading = taskQuery.isFetching;

  useEffect(() => {
    if (taskQuery.error) {
      const error = taskQuery.error as AxiosError<{ message?: string }>;

      message.error(
        error.response?.data?.message || error.message || 'Failed to load Task'
      );
    }
  }, [taskQuery.error]);

  const setTask = (updated: TaskPopulated | null) => {
    queryClient.setQueryData(['task', taskId], updated);
  };

  return {
    task,
    setTask,
    loading,
  };
}
