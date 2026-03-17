import { useEffect, useState } from 'react';
import type { TaskPopulated } from '../../services/types/tasks.types';
import getTaskById from '../../services/taskService';
import { Spin } from 'antd';
import { useIsMobile } from '../../utils/isMobile';
import { TaskModalHeader } from '../taskModal/TaskModalHeader';
import { DrawerTaskView } from './DrawerTaskView';
import type { TaskModalProps } from '../taskModal/taskModal.types';
import { useResizableDrawer } from '../../hooks/useResizableDrawer.ts';

const MIN_DRAWER_WIDTH = 360;
const MAX_DRAWER_WIDTH = 520;

export default function TaskDrawer({ taskId, onClose }: TaskModalProps) {
  const [task, setTask] = useState<TaskPopulated | null>(null);
  const [loading, setLoading] = useState(false);
  const isMobile = useIsMobile(1000);
  const { drawerWidth, startResizing } = useResizableDrawer({
    initialWidth: 420,
    minWidth: MIN_DRAWER_WIDTH,
    maxWidth: MAX_DRAWER_WIDTH,
    enabled: !isMobile,
  });

  useEffect(() => {
    if (!taskId) {
      return;
    }
    let cancelled = false;

    async function loadTask() {
      try {
        setLoading(true);
        const data = await getTaskById(taskId);
        if (!cancelled) {
          setTask(data);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadTask();
    return () => {
      cancelled = true;
    };
  }, [taskId]);

  if (!taskId) {
    return null;
  }

  return (
    <>
      {isMobile && (
        <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />
      )}

      <aside
        className="overflow-hidden border-l border-gray-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900"
        style={
          isMobile
            ? {
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                zIndex: 50,
                width: '100%',
                maxWidth: `${MAX_DRAWER_WIDTH}px`,
              }
            : {
                position: 'relative',
                height: '100%',
                flexShrink: 0,
                width: `${drawerWidth}px`,
              }
        }
        aria-hidden={false}
      >
        {!isMobile && (
          <button
            type="button"
            aria-label="Resize task drawer"
            onMouseDown={startResizing}
            className="hover:bg-primary-300 absolute top-0 bottom-0 left-0 z-10 w-1.5 cursor-col-resize border-r border-transparent hover:border-gray-300 dark:hover:border-slate-600"
          />
        )}

        <div className="flex h-full flex-col">
          <div className="p-3">
            {task && (
              <TaskModalHeader
                task={task}
                onUpdated={setTask}
                onClose={onClose}
                page={false}
                drawer={true}
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
                onUpdated={(task) => setTask(task)}
              />
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
