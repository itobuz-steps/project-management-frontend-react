import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { TaskPopulated } from '../services/types/tasks.types';
import getTaskById from '../services/taskService';
import { TaskView } from '../components/taskDrawer/TaskView';
import { TaskModalHeader } from '../components/taskDrawer/TaskModalHeader';
import { useIsMobile } from '../utils/isMobile';

export default function TaskPage() {
  const { taskId } = useParams();
  const [task, setTask] = useState<TaskPopulated | null>(null);
  const [loading, setLoading] = useState(false);

  const isMobile = useIsMobile(768);

  useEffect(() => {
    if (!taskId) return;

    async function load() {
      setLoading(true);
      const data = await getTaskById(taskId as string);
      setTask(data);
      setLoading(false);
    }

    load();
  }, [taskId]);

  if (!task) return null;

  return (
    <div className="mx-auto w-full p-2 min-[1700px]:max-w-7xl">
      {task && (
        <TaskModalHeader
          task={task}
          // projectId={projectId!}
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
