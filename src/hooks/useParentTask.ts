import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { TaskPopulated } from '../services/types/tasks.types';
import getTaskById from '../services/taskService';
import { message } from 'antd';
import { AxiosError } from 'axios';

export function useParentTask(parentTaskId?: string | null) {
  const parentTaskQuery = useQuery({
    queryKey: ['task', parentTaskId],
    queryFn: () => getTaskById(parentTaskId as string),
    enabled: !!parentTaskId,
  });

  useEffect(() => {
    if (parentTaskQuery.error) {
      const error = parentTaskQuery.error as AxiosError<{ message?: string }>;

      message.error(
        error.response?.data?.message ||
          error.message ||
          'Failed to get parent task'
      );
    }
  }, [parentTaskQuery.error]);

  const parentTask: TaskPopulated | null = parentTaskQuery.data ?? null;

  return parentTask;
}
