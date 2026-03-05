import { useEffect, useState } from 'react';
import { getTasks } from '../services/taskService';
import type { TaskPopulated } from '../services/types/tasks.types';
import { message } from 'antd';

export function useProjectTasks(projectId: string) {
  const [tasks, setTasks] = useState<TaskPopulated[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!projectId) {
      return;
    }

    const fetchTasks = async () => {
      setLoading(true);
      try {
        const data = await getTasks({ projectId });
        setTasks(data);
      } catch {
        message.error('Failed to get tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [projectId]);

  return { tasks, loading };
}
