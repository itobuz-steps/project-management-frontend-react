import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { TaskPopulated } from '../services/types/tasks.types';
import getTaskById from '../services/taskService';
import { TaskView } from '../components/taskModal/TaskView';
import { TaskModalHeader } from '../components/taskModal/TaskModalHeader';
import { useIsMobile } from '../utils/isMobile';
import { useTheme } from '../hooks/useTheme';

export default function TaskPage() {
  const { taskId } = useParams();
  const [task, setTask] = useState<TaskPopulated | null>(null);
  const [loading, setLoading] = useState(false);
  const [, setTheme] = useTheme();
  const isMobile = useIsMobile(768);

  useEffect(() => {
    const savedTheme = localStorage.getItem('lastProjectTheme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, [setTheme]);

  useEffect(() => {
    if (!taskId) {
      return;
    }

    async function load() {
      setLoading(true);
      const data = await getTaskById(taskId as string);
      setTask(data);
      setLoading(false);
    }

    load();
  }, [taskId]);

  if (!task) {
    return null;
  }

  return (
    <div className="mx-auto w-full p-2 min-[1800px]:w-[1800px]">
      {task && (
        <TaskModalHeader
          drawer={false}
          task={task}
          onUpdated={setTask}
          page={true}
        />
      )}

      {task && (
        <TaskView
          task={task}
          isMobile={isMobile}
          onUpdated={setTask}
          loading={loading}
        />
      )}
    </div>
  );
}
