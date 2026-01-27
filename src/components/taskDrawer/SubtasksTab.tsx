import { useEffect, useState } from 'react';
import { Empty, Spin, Modal, Button, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { Task } from '../../types/tasks.types';
import getTaskById, { getAllTasks } from '../../services/taskService';

export function SubtasksTab({ task }: { task: Task }) {
  const [subtasks, setSubtasks] = useState<Task[]>([]);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!task.subTask?.length) return;

    const fetchSubtasks = async () => {
      try {
        setLoading(true);

        const ids = task.subTask as unknown as string[];

        const results = await Promise.all(
          ids.map((id) => getTaskById(id))
        );

        setSubtasks(results);
      } finally {
        setLoading(false);
      }
    };

    fetchSubtasks();
  }, [task.subTask]);

  const openAddSubtaskModal = async () => {
    setOpen(true);
    const tasks = await getAllTasks();
    setAllTasks(tasks);
  };

  if (!task.subTask?.length && !loading) {
    return (
      <div className="flex flex-col items-center gap-4 py-10">
        <Empty />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={openAddSubtaskModal}
        >
          Add Subtask
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* HEADER */}
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-600">
          Subtasks ({subtasks.length})
        </h3>

        <Button
          size="small"
          icon={<PlusOutlined />}
          onClick={openAddSubtaskModal}
        >
          Add
        </Button>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="flex justify-center py-6">
          <Spin />
        </div>
      ) : (
        <div className="space-y-2">
          {subtasks.map((subtask) => (
            <div
              key={subtask._id}
              className="group flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-all hover:border-primary-400 hover:shadow-md"
            >
              <div className="flex flex-col gap-1">
                <span className="font-medium text-gray-800">
                  {subtask.key} — {subtask.title}
                </span>

                <div className="flex gap-2 text-xs">
                  <Tag color="blue">{subtask.type}</Tag>
                  <Tag color="gold">{subtask.status}</Tag>
                </div>
              </div>

              <div className="opacity-0 transition-opacity group-hover:opacity-100">
                <span className="text-xs text-gray-400">
                  Click to open →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD SUBTASK MODAL */}
      <Modal
        title="Add Subtask"
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
      >
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {allTasks.map((t) => (
            <div
              key={t._id}
              className="flex items-center justify-between rounded border p-2 hover:bg-gray-50"
            >
              <span className="text-sm font-medium">
                {t.key} — {t.title}
              </span>

              <Button size="small" type="primary">
                Add
              </Button>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
}
