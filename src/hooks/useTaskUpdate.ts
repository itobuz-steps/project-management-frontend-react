import { message } from 'antd';
import { updateTask } from '../services/taskService';
import type { TaskPopulated } from '../services/types/tasks.types';
import type { OnUpdatedFn } from './hooks.types';

export function useTaskUpdate(taskId: string, onUpdated: OnUpdatedFn) {
  const update = async (payload: Partial<TaskPopulated>, errorMsg: string) => {
    try {
      const updatedTask = await updateTask(
        taskId,
        payload as Partial<TaskPopulated> & { attachments?: File[] }
      );
      onUpdated(updatedTask);
      // notify other parts of the app about this task update (e.g., backlog list)
      const event = new CustomEvent('task-updated', { detail: updatedTask });
      window.dispatchEvent(event);

      message.success('Task Updated');
    } catch {
      message.error(errorMsg);
    }
  };

  return { update };
}
