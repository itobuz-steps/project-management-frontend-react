import { useEffect, useState } from 'react';
import type { TaskPopulated } from '../services/types/tasks.types';
import getTaskById from '../services/taskService';
import { message } from 'antd';

export function useTask(taskId?: string | null) {
  const [task, setTask] = useState<TaskPopulated | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!taskId) {
      setTask(null);
      return;
    }

    async function loadTask() {
      setLoading(true);
      try {
        const data = await getTaskById(taskId as string);
        setTask(data);
      } catch {
        message.error('Failed to load Task');
      } finally {
        setLoading(false);
      }
    }

    loadTask();
  }, [taskId]);

  return { task, setTask, loading };
}
