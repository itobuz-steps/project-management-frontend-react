import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { TaskPopulated } from '../services/types/tasks.types';
import getTaskById, {
  getTaskWorklogs,
  getTotalTimeTracked,
} from '../services/taskService';
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

export function useTaskTotalTracked(taskId?: string | null) {
  const queryClient = useQueryClient();
  const [now, setNow] = useState(() => Date.now());

  const totalTimeTrackedQuery = useQuery({
    queryKey: ['task-total-time-tracked', taskId],
    queryFn: () => getTotalTimeTracked(taskId as string),
    enabled: !!taskId,
  });

  const worklogsQuery = useQuery({
    queryKey: ['task-worklogs', taskId],
    queryFn: () => getTaskWorklogs(taskId as string),
    enabled: !!taskId,
  });

  const activeWorklog =
    worklogsQuery.data?.find((worklog) => !worklog.endTime) || null;

  useEffect(() => {
    if (!taskId) {
      return;
    }

    queryClient.invalidateQueries({
      queryKey: ['task-total-time-tracked', taskId],
    });
  }, [queryClient, taskId, worklogsQuery.dataUpdatedAt]);

  useEffect(() => {
    if (!activeWorklog) {
      return;
    }

    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [activeWorklog]);

  const totalTimeTracked = totalTimeTrackedQuery.data ?? null;

  const liveTrackedMs = (() => {
    const baseMs = totalTimeTracked?.totalTrackedMs ?? 0;

    if (!activeWorklog) {
      return baseMs;
    }

    const startMs = new Date(activeWorklog.startTime).getTime();
    const elapsedMs = Math.max(0, now - startMs);
    return baseMs + elapsedMs;
  })();

  return {
    totalTimeTracked,
    liveTrackedMs,
    loading: totalTimeTrackedQuery.isFetching,
  };
}
