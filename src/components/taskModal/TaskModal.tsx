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
    if (!taskId) {
      return;
    }

    async function loadTask() {
      try {
        setLoading(true);
        const data = await getTaskById(taskId);
        setTask(data);
      } finally {
        setLoading(false);
      }
    }

    loadTask();
  }, [taskId]);

  return (
    <Modal
      open={!!taskId}
      onCancel={onClose}
      closable={false}
      footer={null}
      centered
      width={1200}
      className="task-modal"
      rootClassName="task-modal-root"
      styles={{
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
