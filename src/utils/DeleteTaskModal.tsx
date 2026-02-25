import { Modal, message } from 'antd';
import { useState } from 'react';
import type { TaskPopulated } from '../services/types/tasks.types';
import { deleteTask } from '../services/taskService';

interface Props {
  open: boolean;
  task: TaskPopulated;
  onClose: () => void;
  onDeleted: (taskId: string) => void;
}

export function DeleteTaskModal({ open, task, onClose, onDeleted }: Props) {
  const [deleting, setDeleting] = useState(false);

  const onDelete = async () => {
    try {
      setDeleting(true);
      await deleteTask(task._id);

      message.success('Task deleted');
      onDeleted(task._id);
      onClose();
    } catch (err) {
      console.error(err);
      message.error('Failed to delete task');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Modal
      open={open}
      title="Delete task"
      onCancel={onClose}
      onOk={onDelete}
      okText="Delete"
      okButtonProps={{ danger: true }}
      confirmLoading={deleting}
      destroyOnHidden
      width={520}
      styles={{
        mask: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'none',
        },
      }}
    >
      <p className="text-neutral-700">
        Are you sure you want to delete{' '}
        <strong>
          {task.key} – {task.title}
        </strong>
        ?
      </p>

      <p className="mt-2 text-sm text-neutral-500">
        This action cannot be undone.
      </p>
    </Modal>
  );
}
