import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { TaskPopulated } from '../services/types/tasks.types';
import getTaskById from '../services/taskService';
import { Tag } from 'antd';
import { TaskView } from '../components/taskDrawer/TaskView';
import { TaskTypeIcon } from '../utils/TaskTypeIcon';

export default function TaskPage() {
  const { taskId } = useParams();
  const [task, setTask] = useState<TaskPopulated | null>(null);
  const [loading, setLoading] = useState(false);

  const isMobile = window.innerWidth < 768;

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
    <div className="mx-auto p-6">
      <div className="mb-6 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded bg-gray-100">
          <TaskTypeIcon type={task.type} />
        </div>
        <Tag color="primary">{task.key}</Tag>
        <h1 className="text-xl font-semibold">{task.title}</h1>
      </div>

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
