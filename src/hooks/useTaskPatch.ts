import { message } from 'antd';
import { updateTask } from '../services/taskService';

type PatchFn<T> = (taskId: string, payload: Partial<T>) => void;

export function useTaskPatch<T>(taskId: string, onPatch: PatchFn<T>) {
  const patchTask = async (payload: Partial<T>, errorMsg: string) => {
    onPatch(taskId, payload);

    try {
      await updateTask(taskId, payload);
    } catch {
      message.error(errorMsg);
    }
  };

  return { patchTask };
}
