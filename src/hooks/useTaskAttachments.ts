import { useMemo, useState } from 'react';
import { message } from 'antd';
import { updateTask } from '../services/taskService';
import type {
  TaskAttachment,
  TaskPopulated,
} from '../services/types/tasks.types';

export function useTaskAttachments<
  T extends { _id: string; attachments?: TaskAttachment[] },
>(task: T, onUpdated?: (task: Partial<TaskPopulated>) => void) {
  const [saving, setSaving] = useState(false);

  const attachments = useMemo<TaskAttachment[]>(() => {
    if (!task.attachments) {
      return [];
    }

    return Array.isArray(task.attachments)
      ? task.attachments
      : Array.from(task.attachments);
  }, [task.attachments]);

  const updateAttachments = async (
    updated: TaskAttachment[],
    successMsg: string,
    errorMsg: string
  ) => {
    setSaving(true);

    const existingAttachments = updated.filter(
      (attachment): attachment is string => typeof attachment === 'string'
    );

    const newFiles = updated.filter(
      (attachment): attachment is File => attachment instanceof File
    );

    onUpdated?.({ ...task, attachments: updated });

    try {
      const updatedTask = await updateTask(task._id, {
        existingAttachments,
        attachments: newFiles,
      });
      onUpdated?.(updatedTask);
      message.success(successMsg);
    } catch {
      message.error(errorMsg);
      onUpdated?.(task);
    } finally {
      setSaving(false);
    }
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
    saving,
    addAttachment,
    removeAttachment,
  };
}
