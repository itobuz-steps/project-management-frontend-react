import type { TaskModalProps } from './taskModal.types';
import { Modal, Spin } from 'antd';
import { TaskView } from './TaskView';
import { TaskModalHeader } from './TaskModalHeader';
import { useIsMobile } from '../../utils/isMobile';
import { useTask } from '../../hooks/useTask';

export default function TaskModal({ taskId, onClose }: TaskModalProps) {
  const isMobile = useIsMobile(768);
  const { task, setTask, loading } = useTask(taskId);

  return (
    <Modal
      open={Boolean(taskId)}
      onCancel={onClose}
      closable={false}
      footer={null}
      centered
      width={1200}
      className="task-modal"
      rootClassName="task-modal-root"
      destroyOnHidden
      styles={{
        mask: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'none',
        },
      }}
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
          onUpdated={setTask}
        />
      )}
    </Modal>
  );
}
