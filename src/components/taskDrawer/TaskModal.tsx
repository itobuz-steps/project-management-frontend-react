import type { TaskModalProps } from './taskDrawer.type';
import { useEffect, useState } from 'react';
import { Modal, Spin } from 'antd';
import type { TaskPopulated } from '../../services/types/tasks.types';
import getTaskById from '../../services/taskService';
import { TaskView } from './TaskView';
import { TaskModalHeader } from './TaskModalHeader';
import { useIsMobile } from '../../utils/isMobile';

export default function TaskModal({ taskId, onClose }: TaskModalProps) {
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

  return (
    <Modal
      open={!!taskId}
      onCancel={onClose}
      closable={false}
      footer={null}
      centered={!isMobile}
      width={isMobile ? '100%' : 1200}
      styles={{
        header: {
          margin: 0,
        },
        body: {
          padding: 0,
          height: isMobile ? 'calc(100vh - 56px)' : '70vh',
          maxHeight: 700,
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
          <TaskModalHeader
            task={task}
            onUpdated={setTask}
            onClose={onClose}
            page={false}
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
