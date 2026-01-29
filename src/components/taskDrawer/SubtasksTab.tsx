import { useEffect, useState } from 'react';
import { Empty, Spin, Modal, Checkbox, Button, Tag, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';

import type { Task } from '../../types/tasks.types';
import getTaskById, {
  getTaskByProjectId,
  updateTask,
} from '../../services/taskService';
import { Trash2 } from 'lucide-react';

export function SubtasksTab({ task }: { task: Task }) {
  const navigate = useNavigate();
  const { projectId, taskId: currentTaskId } = useParams();

  const selectedIds = (task.subTask ?? []) as string[];

  const [subtasks, setSubtasks] = useState<Task[]>([]);
  const [projectTasks, setProjectTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

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

    const tasks = await getTaskByProjectId(projectId as string);

    setProjectTasks(tasks.filter((t: Task) => t._id !== task._id));
  };

  const toggleSubtask = async (subtaskId: string, checked: boolean) => {
    const updated = checked
      ? [...new Set([...selectedIds, subtaskId])]
      : selectedIds.filter((id) => id !== subtaskId);

    try {
      await updateTask(task._id, {
        subTask: updated,
      });

      message.success(
        checked ? 'Subtask added successfully' : 'Subtask removed successfully'
      );
    } catch (error) {
      console.error(error);
      message.error('Failed to update subtask');
    }
  };

  const removeSubtask = async (subtaskId: string) => {
    const updated = selectedIds.filter((id) => id !== subtaskId);

    // optimistic UI
    setSubtasks((prev) => prev.filter((t) => t._id !== subtaskId));

    try {
      await updateTask(task._id, {
        subTask: updated,
      });

      message.success('Subtask removed');
    } catch (error) {
      console.error(error);
      message.error('Failed to remove subtask');
    }
  };

  const openSubtask = (subtaskId: string) => {
    navigate(`/dashboard/${projectId}/${subtaskId}`);
  };

  return (
    <>
      {/* HEADER */}
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-600">
          Subtasks ({selectedIds.length})
        </h3>

        <Button size="small" icon={<PlusOutlined />} onClick={openModal}>
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
                  {subtask.key} — {subtask.title}
                </div>
                <div className="mt-1 flex gap-2">
                  <Tag color="blue">{subtask.type}</Tag>
                  <Tag color="gold">{subtask.status}</Tag>
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
        footer={null}
      >
        <div className="max-h-[420px] space-y-2 overflow-y-auto">
          {projectTasks.map((t) => {
            const isSubtask = selectedIds.includes(t._id);

            return (
              <div
                key={t._id}
                className={`flex items-center justify-between rounded border p-2 transition ${isSubtask ? 'border-primary-400 bg-primary-50' : 'hover:bg-gray-50'} `}
              >
                <div>
                  <div className="text-sm font-medium">
                    {t.key} — {t.title}
                  </div>

                  <div className="flex gap-2 text-xs text-gray-500">
                    <span>{t.type}</span>
                    <span>·</span>
                    <span>{t.status}</span>

                    {isSubtask && (
                      <Tag color="green" className="ml-2">
                        Subtask
                      </Tag>
                    )}
                  </div>
                </div>

                <Checkbox
                  checked={selectedIds.includes(t._id)}
                  onChange={(e) => toggleSubtask(t._id, e.target.checked)}
                />
              </div>
            );
          })}
        </div>
      </Modal>
    </>
  );
}
