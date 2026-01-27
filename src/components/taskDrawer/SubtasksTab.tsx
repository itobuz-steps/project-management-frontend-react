import { useEffect, useState } from 'react';
import { Empty, Spin, Modal, Checkbox, Button, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useSearchParams } from 'react-router-dom';

import type { Task } from '../../types/tasks.types';
import getTaskById, {
  getTaskByProjectId,
  updateTask,
} from '../../services/taskService';

export function SubtasksTab({ task }: { task: Task }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const projectId = searchParams.get('projectId')!;
  const currentTaskId = searchParams.get('taskId');

  const [subtasks, setSubtasks] = useState<Task[]>([]);
  const [projectTasks, setProjectTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const selectedIds = (task.subTask ?? []) as unknown as string[];

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
    const tasks = await getTaskByProjectId(projectId);
    setProjectTasks(tasks.filter((t: Task) => t._id !== task._id));
  };

  const toggleSubtask = async (subtaskId: string, checked: boolean) => {
    const updatedSubtasks = checked
      ? [...new Set([...selectedIds, subtaskId])]
      : selectedIds.filter((id) => id !== subtaskId);

    await updateTask(task._id, {
      subTask: updatedSubtasks,
    });
  };

  const openSubtask = (subtaskId: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('taskId', subtaskId);
    setSearchParams(params);
  };

  return (
    <>
      {/* HEADER */}
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-600">
          Subtasks ({subtasks.length})
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
      ) : !subtasks.length ? (
        <Empty />
      ) : (
        <div className="space-y-2">
          {subtasks.map((subtask) => (
            <div
              key={subtask._id}
              onClick={() => openSubtask(subtask._id)}
              className={`group flex cursor-pointer items-center justify-between rounded-lg border p-3 transition ${
                currentTaskId === subtask._id
                  ? 'border-primary-400 bg-primary-50'
                  : 'bg-white hover:shadow-md'
              }`}
            >
              <div>
                <div className="font-medium">
                  {subtask.key} — {subtask.title}
                </div>
                <div className="mt-1 flex gap-2">
                  <Tag color="blue">{subtask.type}</Tag>
                  <Tag color="gold">{subtask.status}</Tag>
                </div>
              </div>

              <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100">
                Open →
              </span>
            </div>
          ))}
        </div>
      )}

      {/* MANAGE SUBTASK MODAL */}
      <Modal
        title="Manage Subtasks"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
      >
        <div className="max-h-[420px] space-y-2 overflow-y-auto">
          {projectTasks.map((t) => {
            const checked = selectedIds.includes(t._id);

            return (
              <div
                key={t._id}
                className="flex items-center justify-between rounded border p-2 hover:bg-gray-50"
              >
                <div>
                  <div className="text-sm font-medium">
                    {t.key} — {t.title}
                  </div>
                  <div className="text-xs text-gray-500">
                    {t.type} · {t.status}
                  </div>
                </div>

                <Checkbox
                  checked={checked}
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
