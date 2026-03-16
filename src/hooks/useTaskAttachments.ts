import { useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { updateTask } from '../services/taskService';
import type {
  TaskAttachment,
  TaskPopulated,
  BackendAttachment,
} from '../services/types/tasks.types';
import type {
  AttachmentMutationType,
  TaskWithAttachments,
} from './hooks.types';
import { AxiosError } from 'axios';

export function useTaskAttachments(
  task: TaskWithAttachments,
  onUpdated?: (task: TaskPopulated) => void
) {
  const queryClient = useQueryClient();

  const attachments = useMemo<TaskAttachment[]>(() => {
    return Array.isArray(task.attachments)
      ? task.attachments
      : task.attachments
        ? Array.from(task.attachments)
        : [];
  }, [task.attachments]);

  const mutation = useMutation({
    mutationFn: async ({ updated, successMsg }: AttachmentMutationType) => {
      const existingAttachments: string[] = updated.reduce<string[]>(
        (acc, attachment) => {
          if (typeof attachment === 'string') {
            acc.push(attachment);
          } else if (
            attachment &&
            typeof attachment === 'object' &&
            (attachment as BackendAttachment).key
          ) {
            acc.push((attachment as BackendAttachment).key);
          }

          return acc;
        },
        []
      );

      const newFiles = updated.filter(
        (attachment): attachment is File => attachment instanceof File
      );

      let updatedTask: TaskPopulated;

      if (newFiles.length) {
        updatedTask = await updateTask(task._id, {
          existingAttachments,
          attachments: newFiles,
        });
      } else {
        updatedTask = await updateTask(task._id, {
          existingAttachments,
        });
      }

      return { updatedTask, successMsg };
    },

    onSuccess: ({ updatedTask, successMsg }) => {
      queryClient.setQueryData<TaskPopulated>(['task', task._id], updatedTask);

      onUpdated?.(updatedTask);
      message.success(successMsg);
    },

    onError: (error, variables) => {
      if (error instanceof AxiosError) {
        message.error(
          error.response?.data?.message || error.message || variables.errorMsg
        );
      }
    },
  });

  const updateAttachments = (
    updated: TaskAttachment[],
    successMsg: string,
    errorMsg: string
  ) => {
    mutation.mutate({ updated, successMsg, errorMsg });
  };

  const addAttachment = (file: File) => {
    updateAttachments(
      [...attachments, file],
      'Attachment added',
      'Failed to add attachment'
    );
  };

  const removeAttachment = (target: TaskAttachment) => {
    updateAttachments(
      attachments.filter((attachment) => attachment !== target),
      'Attachment removed',
      'Failed to remove attachment'
    );
  };

  return {
    attachments,
    saving: mutation.isPending,
    addAttachment,
    removeAttachment,
  };
}
