import { useEffect, useState } from 'react';
import type { TaskPopulated } from '../services/types/tasks.types';
import getTaskById from '../services/taskService';
import { message } from 'antd';

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
        message.error('Failed to get parent task');
        setParentTask(null);
      }
    }

    load();
  }, [parentTaskId]);

  return parentTask;
}
