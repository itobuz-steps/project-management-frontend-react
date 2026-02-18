import { useEffect, useState } from 'react';
import type { TaskPopulated } from '../../services/types/tasks.types';
import getTaskById from '../../services/taskService';
import { Spin } from 'antd';
import { useIsMobile } from '../../utils/isMobile';
import { TaskModalHeader } from '../taskModal/TaskModalHeader';
import { DrawerTaskView } from './DrawerTaskView';
import type { TaskModalProps } from '../taskModal/taskModal.types';

export default function TaskDrawer({ taskId, onClose }: TaskModalProps) {
  const [task, setTask] = useState<TaskPopulated | null>(null);
  const [loading, setLoading] = useState(false);
  const isMobile = useIsMobile(768);

  useEffect(() => {
    if (!taskId) return;
    let cancelled = false;

    async function loadTask() {
      try {
        setLoading(true);
        const data = await getTaskById(taskId);
        if (!cancelled) setTask(data);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadTask();
    return () => {
      cancelled = true;
    };
  }, [taskId]);

  if (!taskId) return null;

  return (
    <div className="fixed inset-0 z-50 flex" aria-hidden={false}>
      <div className="flex-1" onClick={onClose} />

      <aside
        className={`h-full overflow-hidden bg-white shadow-xl ${
          isMobile ? 'w-full' : 'w-96'
        }`}
      >
        {/* Close button top-right */}
        {/* <button
          type="button"
          aria-label="Close task drawer"
          onClick={onClose}
          className="absolute top-3 right-3 z-10 rounded p-2 hover:bg-gray-100"
        >
          <CloseOutlined />
        </button> */}
        <div className="flex h-full flex-col">
          <div className="p-3">
            {task && (
              <TaskModalHeader
                task={task}
                onUpdated={setTask}
                onClose={onClose}
                page={false}
              />
            )}
          </div>

          <div className="h-full overflow-auto">
            {loading && (
              <div className="flex justify-center py-20">
                <Spin size="large" />
              </div>
            )}

            {!loading && task && (
              <DrawerTaskView
                task={task}
                isMobile={isMobile}
                onUpdated={(t) => setTask(t)}
              />
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
