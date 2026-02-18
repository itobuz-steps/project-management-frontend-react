import { useEffect, useState } from 'react';
import type { TaskPopulated } from '../services/types/tasks.types';
import getTaskById from '../services/taskService';

export function useParentTask(parentTaskId?: string | null) {
  const [parentTask, setParentTask] = useState<TaskPopulated | null>(null);

  useEffect(() => {
    if (!parentTaskId) {
      return;
    }

    async function load() {
      try {
        const task = await getTaskById(parentTaskId as string);
        setParentTask(task);
      } catch {
        setParentTask(null);
      }
    }

    load();
  }, [parentTaskId]);

  return parentTask;
}
