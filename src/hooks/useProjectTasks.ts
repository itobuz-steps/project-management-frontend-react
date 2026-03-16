import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTasks } from '../services/taskService';
import type { TaskPopulated } from '../services/types/tasks.types';
import { message } from 'antd';
import { AxiosError } from 'axios';

export function useProjectTasks(projectId: string) {
  const tasksQuery = useQuery({
    queryKey: ['projectTasks', projectId],
    queryFn: () => getTasks({ projectId }),
    enabled: !!projectId,
  });

  const tasks: TaskPopulated[] = tasksQuery.data ?? [];
  const loading = tasksQuery.isFetching;

  useEffect(() => {
    if (tasksQuery.error) {
      const error = tasksQuery.error as AxiosError<{ message?: string }>;

      message.error(
        error.response?.data?.message || error.message || 'Failed to get tasks'
      );
    }
  }, [tasksQuery.error]);

  return { tasks, loading };
}
