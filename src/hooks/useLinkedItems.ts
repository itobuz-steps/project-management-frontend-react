import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTask } from '../services/taskService';
import type {
  TaskPopulated,
  TaskReference,
} from '../services/types/tasks.types';
import type { RelationshipKey } from '../components/linkedItems/linkedItems.types';
import { RELATIONSHIP_CONFIG } from '../components/linkedItems/linkedItems.types';
import { message } from 'antd';
import { AxiosError } from 'axios';

export function useLinkedItems(
  task: TaskPopulated,
  onUpdated: (task: TaskPopulated) => void
) {
  const queryClient = useQueryClient();

  const normalizeIds = (items: TaskReference[] = []) =>
    Array.from(new Set(items.map((item) => item?._id).filter(Boolean)));

  const getAllLinkedIds = () => {
    const allIds: string[] = [];

    (Object.keys(RELATIONSHIP_CONFIG) as RelationshipKey[]).forEach((key) => {
      allIds.push(...normalizeIds(task[key]));
    });

    return Array.from(new Set(allIds));
  };

  const mutation = useMutation({
    mutationFn: async ({
      type,
      targetId,
      action,
    }: {
      type: RelationshipKey;
      targetId: string;
      action: 'add' | 'remove';
    }) => {
      const currentIds = normalizeIds(task[type]);

      const updatedIds =
        action === 'add'
          ? [...currentIds, targetId]
          : currentIds.filter((id) => id !== targetId);

      const updatedTask = await updateTask(task._id, {
        [type]: updatedIds,
      });

      return updatedTask;
    },

    onSuccess: (updatedTask) => {
      queryClient.setQueryData(['task', task._id], updatedTask);

      onUpdated(updatedTask);
    },

    onError: (error) => {
      const axiosError = error as AxiosError<{ message?: string }>;

      message.error(
        axiosError.response?.data?.message ||
          axiosError.message ||
          'Failed to update linked task'
      );
    },
  });

  const addLinkedItem = async (type: RelationshipKey, targetId: string) => {
    const allLinkedIds = getAllLinkedIds();

    if (allLinkedIds.includes(targetId)) {
      return;
    }

    await mutation.mutateAsync({ type, targetId, action: 'add' });

    message.success('Linked task added');
  };

  const removeLinkedItem = async (type: RelationshipKey, targetId: string) => {
    await mutation.mutateAsync({ type, targetId, action: 'remove' });

    message.success('Linked task removed');
  };

  return {
    loading: mutation.isPending,
    addLinkedItem,
    removeLinkedItem,
  };
}
