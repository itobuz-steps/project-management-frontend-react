import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import TaskService from '../../services/taskService';
import type { Task } from '../../types/tasks.types';

interface TaskDrawerProps {
  taskId: string | null;
  onClose: () => void;
}

export default function TaskDrawer({ taskId, onClose }: TaskDrawerProps) {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!taskId) return;

    let cancelled = false;

    const loadTask = async () => {
      try {
        setLoading(true);

        const task = await TaskService.getTaskById(taskId);

        if (!cancelled) {
          setTask(task);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to fetch task', err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadTask();

    return () => {
      cancelled = true;
    };
  }, [taskId]);

  const closeDrawer = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('taskId');
    window.history.pushState({}, '', url.toString());
    onClose();
  };

  if (!taskId) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/30" onClick={closeDrawer} />

      {/* Drawer */}
      <aside className="fixed top-0 right-0 z-50 h-full w-[420px] bg-white shadow-xl transition-transform">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-sm font-semibold text-gray-700">
            {task?.key ?? 'Loading…'}
          </h2>
          <button
            onClick={closeDrawer}
            className="rounded p-1 hover:bg-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="h-full overflow-y-auto p-4">
          {loading && <p className="text-sm text-gray-400">Loading task…</p>}

          {!loading && task && (
            <>
              {/* Title */}
              <h1 className="mb-4 text-lg font-semibold">{task.title}</h1>

              {/* Meta */}
              <div className="mb-6 space-y-2 text-sm">
                <MetaRow label="Status" value={task.status} />
                <MetaRow label="Type" value={task.type ?? 'Task'} />
                <MetaRow
                  label="Assignee"
                  value={task.assignee?.name ?? 'Unassigned'}
                />
                <MetaRow
                  label="Reporter"
                  value={task.reporter?.name ?? 'Unknown'}
                />
                <MetaRow
                  label="Due Date"
                  value={
                    task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString()
                      : '—'
                  }
                />
              </div>

              {/* Description */}
              <section className="mb-6">
                <h3 className="mb-1 text-sm font-semibold text-gray-600">
                  Description
                </h3>
                <p className="text-sm whitespace-pre-wrap text-gray-700">
                  {task.description || 'No description'}
                </p>
              </section>

              {/* Labels */}
              <section className="mb-6">
                <h3 className="mb-1 text-sm font-semibold text-gray-600">
                  Labels
                </h3>
                <div className="flex flex-wrap gap-1">
                  {task.labels?.length ? (
                    task.labels.map((label) => (
                      <span
                        key={label}
                        className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700"
                      >
                        {label}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )}
                </div>
              </section>

              {/* Subtasks */}
              <section>
                <h3 className="mb-2 text-sm font-semibold text-gray-600">
                  Subtasks
                </h3>

                {task.subtasks?.length ? (
                  <ul className="space-y-1">
                    {task.subtasks.map((subtask) => (
                      <li
                        key={subtask._id}
                        className="rounded border px-2 py-1 text-sm"
                      >
                        {subtask.title}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-400">No subtasks</p>
                )}
              </section>
            </>
          )}
        </div>
      </aside>
    </>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-800">{value}</span>
    </div>
  );
}
