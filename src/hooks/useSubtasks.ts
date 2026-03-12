import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { TaskPopulated } from '../services/types/tasks.types';
import getTaskById, { updateTask } from '../services/taskService';
import { message } from 'antd';

export function useSubtasks(task: TaskPopulated) {
  const [selectedIds, setSelectedIds] = useState<string[]>(
    (task.subTasks ?? []) as string[]
  );
  const queryClient = useQueryClient();

  const subtasksQuery = useQuery({
    queryKey: ['subtasks', selectedIds],
    queryFn: () => Promise.all(selectedIds.map(getTaskById)),
    enabled: !!selectedIds.length,
  });

  const subtasks = subtasksQuery.data ?? [];
  const loading = !!selectedIds.length && subtasksQuery.isFetching;

  useEffect(() => {
    if (subtasksQuery.isError) {
      message.error('Failed to get tasks');
    }
  }, [subtasksQuery.isError]);

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateTask(id, { status }),
    onMutate: async ({ id, status }) => {
      const queryKey = ['subtasks', selectedIds] as const;
      await queryClient.cancelQueries({ queryKey });

      const previousSubtasks =
        queryClient.getQueryData<TaskPopulated[]>(queryKey);

      queryClient.setQueryData<TaskPopulated[]>(queryKey, (current = []) =>
        current.map((item) => (item._id === id ? { ...item, status } : item))
      );

      return { previousSubtasks, queryKey };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousSubtasks) {
        queryClient.setQueryData(context.queryKey, context.previousSubtasks);
      }
      message.error('Failed to update subtask status.');
    },
    onSuccess: () => {
      message.success('Subtask status updated.');
    },
  });

  const removeSubtaskMutation = useMutation({
    mutationFn: async ({
      id,
      updatedIds,
    }: {
      id: string;
      updatedIds: string[];
    }) => {
      await Promise.all([
        updateTask(task._id, { subTasks: updatedIds }),
        updateTask(id, { parentTask: null }),
      ]);
    },
    onMutate: async ({ id, updatedIds }) => {
      const previousQueryKey = ['subtasks', selectedIds] as const;
      await queryClient.cancelQueries({ queryKey: previousQueryKey });

      const previousSubtasks =
        queryClient.getQueryData<TaskPopulated[]>(previousQueryKey);
      const nextSubtasks = (previousSubtasks ?? []).filter(
        (item) => item._id !== id
      );

      setSelectedIds(updatedIds);
      queryClient.setQueryData(['subtasks', updatedIds], nextSubtasks);

      return {
        previousQueryKey,
        previousSubtasks,
        previousSelectedIds: selectedIds,
      };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousSubtasks) {
        queryClient.setQueryData(
          context.previousQueryKey,
          context.previousSubtasks
        );
      }
      if (context?.previousSelectedIds !== undefined) {
        setSelectedIds(context.previousSelectedIds);
      }
      message.error('Failed to remove task');
    },
  });

  const updateSubtask = (updated: TaskPopulated) => {
    queryClient.setQueryData<TaskPopulated[]>(
      ['subtasks', selectedIds],
      (prev = []) =>
        prev.map((item) => (item._id === updated._id ? updated : item))
    );
  };

  const updateStatus = async (id: string, status: string) => {
    await updateStatusMutation.mutateAsync({ id, status });
  };

  const removeSubtask = async (id: string) => {
    const updatedIds = selectedIds.filter((task) => task !== id);
    await removeSubtaskMutation.mutateAsync({ id, updatedIds });
  };

  return {
    selectedIds,
    setSelectedIds,
    subtasks,
    loading,
    updateSubtask,
    updateStatus,
    removeSubtask,
  };
}
