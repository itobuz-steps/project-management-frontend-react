import { useEffect, useState } from 'react';
import { Empty, Spin, Modal, Checkbox, Button, Tag, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useParams, useSearchParams } from 'react-router-dom';
import { UserCell } from '../../utils/UserCell';
import type { TaskPopulated } from '../../services/types/tasks.types';
import getTaskById, {
  getTaskByProjectId,
  updateTask,
} from '../../services/taskService';
import { Trash2 } from 'lucide-react';
import { TaskTypeIcon } from '../../utils/TaskTypeIcon';

export function SubtasksTab({ task }: { task: TaskPopulated }) {
  const [, setSearchParams] = useSearchParams();
  const { projectId, taskId: currentTaskId } = useParams();

  const [selectedIds, setSelectedIds] = useState<string[]>(
    (task.subTask ?? []) as string[]
  );

  const [subtasks, setSubtasks] = useState<TaskPopulated[]>([]);
  const [projectTasks, setProjectTasks] = useState<TaskPopulated[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    function setupSelectedIds() {
      setSelectedIds((task.subTask ?? []) as string[]);
    }

    setupSelectedIds();
  }, [task._id, task.subTask]);

  useEffect(() => {
    if (!selectedIds.length) return;

    let cancelled = false;

    const fetchSubtasks = async () => {
      setLoading(true);

      const results = await Promise.all(
        selectedIds.map((id) => getTaskById(id))
      );

      if (!cancelled) {
        setSubtasks(results);
        setLoading(false);
      }
    };

    fetchSubtasks();

    return () => {
      cancelled = true;
    };
  }, [selectedIds.join(',')]);

  const openModal = async () => {
    setModalOpen(true);

    const tasks = await getTaskByProjectId(
      (projectId as string) ?? task.projectId
    );

    setProjectTasks(
      tasks.filter((newTask: TaskPopulated) => newTask._id !== task._id)
    );
  };

  const toggleSubtask = (subtaskId: string, checked: boolean) => {
    setSelectedIds((prev) =>
      checked
        ? [...new Set([...prev, subtaskId])]
        : prev.filter((id) => id !== subtaskId)
    );
  };

  const removeSubtask = async (subtaskId: string) => {
    const updatedIds = selectedIds.filter((id) => id !== subtaskId);
    setSelectedIds(updatedIds);
    setSubtasks((prev) => prev.filter((task) => task._id !== subtaskId));

    try {
      await updateTask(task._id, {
        subTask: updatedIds,
      });

      message.success('Subtask removed');
    } catch {
      message.error('Failed to remove subtask');
    }
  };

  const handleSaveSubtasks = async () => {
    try {
      await updateTask(task._id, {
        subTask: selectedIds,
      });

      message.success('Subtasks updated');
      setModalOpen(false);
    } catch (error) {
      console.error(error);
      message.error('Failed to update subtasks');
    }
  };

  const openSubtask = (subtaskId: string) => {
    setSearchParams({ taskId: subtaskId }, { replace: true });
  };

  return (
    <>
      {/* HEADER */}
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-600">
          Subtasks ({selectedIds.length})
        </h3>

        <Button
          size="small"
          icon={<PlusOutlined />}
          onClick={openModal}
          style={{
            backgroundColor: 'var(--color-primary-400)',
            color: 'white',
          }}
        >
          Manage
        </Button>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="flex justify-center py-6">
          <Spin />
        </div>
      ) : !selectedIds.length ? (
        <Empty />
      ) : (
        <div className="space-y-2">
          {subtasks.map((subtask) => (
            <div
              key={subtask._id}
              className={`group flex items-center justify-between rounded-lg border p-3 transition ${
                currentTaskId === subtask._id
                  ? 'border-primary-400 bg-primary-50'
                  : 'bg-white hover:shadow-md'
              }`}
            >
              <div
                className="flex-1 cursor-pointer"
                onClick={() => openSubtask(subtask._id)}
              >
                <div className="font-medium">
                  <Tag color="blue">{subtask.key}</Tag> {subtask.title}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1">
                    <TaskTypeIcon type={subtask.type} />
                    <span className="text-xs text-gray-600 capitalize">
                      {subtask.type}
                    </span>
                  </div>

                  <Tag color="gold">{subtask.status}</Tag>

                  <UserCell user={subtask.assignee} emptyText="Unassigned" />
                </div>
              </div>

              <Button
                size="small"
                danger
                type="text"
                onClick={(e) => {
                  e.stopPropagation();
                  removeSubtask(subtask._id);
                }}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      <Modal
        title="Manage Subtasks"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSaveSubtasks}
        footer={[
          <Button key="cancel" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>,
          <Button key="save" type="primary" onClick={handleSaveSubtasks}>
            Save
          </Button>,
        ]}
        styles={{
          mask: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'none',
          },
        }}
      >
        <div className="max-h-[420px] space-y-2 overflow-y-auto">
          {projectTasks.map((task) => {
            const isSubtask = selectedIds.includes(task._id);

            return (
              <div
                key={task._id}
                className={`flex items-center justify-between rounded border p-2 transition ${isSubtask ? 'border-primary-400 bg-primary-50' : 'hover:bg-gray-50'} `}
              >
                <div>
                  <div className="text-sm font-medium">
                    <Tag color="blue">{task.key}</Tag> {task.title}
                  </div>

                  <div className="flex gap-2 text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <TaskTypeIcon type={task.type} />
                      <span className="text-xs text-gray-600 capitalize">
                        {task.type}
                      </span>
                    </div>

                    <Tag color="gold">{task.status}</Tag>

                    {isSubtask && (
                      <Tag color="green" className="ml-2">
                        Subtask
                      </Tag>
                    )}
                  </div>
                </div>

                <Checkbox
                  checked={selectedIds.includes(task._id)}
                  onChange={(e) => toggleSubtask(task._id, e.target.checked)}
                />
              </div>
            );
          })}
        </div>
      </Modal>
    </>
  );
}
