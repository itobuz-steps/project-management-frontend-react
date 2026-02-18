import { message } from 'antd';
import { updateTask } from '../services/taskService';
import type { TaskPopulated } from '../services/types/tasks.types';

type OnUpdatedFn = (updated: TaskPopulated) => void;

export function useTaskUpdate(taskId: string, onUpdated: OnUpdatedFn) {
  const update = async (payload: Partial<TaskPopulated>, errorMsg: string) => {
    try {
      const updatedTask = await updateTask(taskId, payload);
      onUpdated(updatedTask);
    } catch {
      message.error(errorMsg);
    }
  };

  return { update };
}
