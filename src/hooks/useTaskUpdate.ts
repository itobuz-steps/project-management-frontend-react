import { message } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTask } from '../services/taskService';
import type { TaskPopulated } from '../services/types/tasks.types';
import type { OnUpdatedFn } from './hooks.types';
import { AxiosError } from 'axios';

export function useTaskUpdate(taskId: string, onUpdated: OnUpdatedFn) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: Partial<TaskPopulated>) =>
      updateTask(
        taskId,
        payload as Partial<TaskPopulated> & { attachments?: File[] }
      ),

    onSuccess: (updatedTask) => {
      // update task cache
      queryClient.setQueryData(['task', taskId], updatedTask);

      // update parent lists if cached
      queryClient.invalidateQueries({ queryKey: ['tasks'] });

      onUpdated(updatedTask);

      const event = new CustomEvent('task-updated', { detail: updatedTask });
      window.dispatchEvent(event);

      message.success('Task Updated');
    },

    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        message.error(
          error.response?.data?.message || error.message || 'Failed to update'
        );
      }
    },
  });

  const update = async (
    payload: Partial<TaskPopulated>,
    errorMsg = 'Failed to update'
  ) => {
    try {
      await mutation.mutateAsync(payload);
    } catch {
      message.error(errorMsg);
    }
  };

  return {
    update,
    loading: mutation.isPending,
  };
}
