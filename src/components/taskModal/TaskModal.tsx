import type { TaskModalProps } from './taskModal.types';
import { Modal } from 'antd';
import { TaskView } from './TaskView';
import { TaskModalHeader } from './TaskModalHeader';
import { useIsMobile } from '../../utils/isMobile';
import { useTask } from '../../hooks/useTask';
import { DataLoader } from '../ui/DataLoader';

export default function TaskModal({
  taskId,
  onClose,
  onToggleView,
  isDrawerView,
}: TaskModalProps) {
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
            drawer={false}
            task={task}
            onUpdated={setTask}
            onClose={onClose}
            page={false}
            onToggleView={onToggleView}
            isDrawerView={isDrawerView}
          />
        )
      }
    >
      <DataLoader
        loading={loading}
        isEmpty={!loading && !task}
        emptyText="Task not found"
      >
        {task && (
          <TaskView
            task={task}
            loading={loading}
            isMobile={isMobile}
            onUpdated={setTask}
          />
        )}
      </DataLoader>
    </Modal>
  );
}
