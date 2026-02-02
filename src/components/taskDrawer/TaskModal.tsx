import { Grid } from 'antd';
const { useBreakpoint } = Grid;
import type { TaskModalProps } from './taskDrawer.type';
import { useEffect, useState } from 'react';
import { Modal, Spin } from 'antd';
import type { TaskPopulated } from '../../services/types/tasks.types';
// import { ExportOutlined } from '@ant-design/icons';
import getTaskById from '../../services/taskService';
import { TaskView } from './TaskView';
import { TaskDrawerHeader } from './TaskDrawerHeader';

export default function TaskModal({ taskId, onClose }: TaskModalProps) {
  const [task, setTask] = useState<TaskPopulated | null>(null);
  const [loading, setLoading] = useState(false);
  // const navigate = useNavigate();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

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

  return (
    <Modal
      open={!!taskId}
      onCancel={onClose}
      closable={true}
      footer={null}
      centered={!isMobile}
      width={isMobile ? '100%' : 1000}
      style={{
        top: isMobile ? 0 : 32,
        paddingBottom: 0,
      }}
      styles={{
        header: {
          padding: '12px 16px',
          borderBottom: '1px solid #e5e7eb',
          margin: 0,
        },
        body: {
          padding: 0,
          height: isMobile ? 'calc(100vh - 56px)' : '70vh',
          overflow: 'hidden',
        },

        mask: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'none',
        },
      }}
      destroyOnHidden
      title={
        task && (
          <TaskDrawerHeader
            task={task}
            // projectId={projectId!}
            onUpdated={setTask}
          />
        )
      }
    >
      {loading && (
        <div className="flex justify-center py-20">
          <Spin size="large" />
        </div>
      )}
      {!loading && task && (
        <TaskView
          task={task}
          loading={loading}
          isMobile={isMobile}
          onUpdated={(updatedTask) => {
            setTask(updatedTask);
          }}
        />
      )}
    </Modal>
  );
}
