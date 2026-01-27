import { X, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Task } from '../../types/tasks.types';
import getTaskById from '../../services/taskService';

interface TaskDrawerProps {
  taskId: string;
  onClose: () => void;
}

export default function TaskDrawer({ taskId, onClose }: TaskDrawerProps) {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    let cancelled = false;

    async function loadTask() {
      try {
        setLoading(true);
        const data = await getTaskById(taskId);
        console.log('Fetched task:', data);

        if (!cancelled) setTask(data);
      } catch (err) {
        console.error('Failed to fetch task', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadTask();
    return () => {
      cancelled = true;
    };
  }, [taskId]);

  const closeDrawer = () => {
    searchParams.delete('taskId');
    setSearchParams(searchParams);
    onClose();
  };

  if (!taskId) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30" onClick={closeDrawer} />

      <aside className="fixed top-0 right-0 z-50 h-full w-[420px] bg-white shadow-xl">
        <div className="flex items-start justify-between gap-3 border-b p-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="bg-primary-500 rounded-sm px-2 py-0.5 text-xs font-semibold text-white">
                {task?.key ?? '—'}
              </span>
            </div>
            <h2 className="text-[16px] font-semibold">
              {loading ? 'Loading…' : task?.title}
            </h2>
          </div>

          <button
            onClick={closeDrawer}
            className="rounded p-1 hover:bg-gray-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex h-full flex-col gap-4 overflow-y-auto p-4">
          {loading && <p className="text-sm text-gray-400">Loading task…</p>}

          {!loading && task && (
            <>
              <div className="flex items-center gap-3">
                <img
                  src="/assets/img/profile.png"
                  className="h-8 w-8 rounded-full border"
                />
                <div>
                  <p className="text-xs text-gray-500">Assignee</p>
                  <p className="text-primary-500 font-medium">
                    {task.assignee?.name ?? 'Unassigned'}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-sm text-gray-500">Due Date</p>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString()
                    : '—'}
                </div>
              </div>

              <section className="flex flex-col gap-2">
                <h3 className="font-semibold">Description</h3>
                <div className="prose max-h-28 overflow-auto rounded-md border p-2 text-sm">
                  {task.description || 'No description added…'}
                </div>
              </section>

              <section className="flex flex-col gap-2">
                <h3 className="font-semibold">Subtasks</h3>

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

              <section className="flex flex-col gap-3">
                <h3 className="font-semibold">Details</h3>

                <DetailRow label="Status" value={task.status} />
                <DetailRow label="Priority" value={task.priority} />
                <DetailRow label="Type" value={task.type} />
                <DetailRow
                  label="Reporter"
                  value={task.reporter?.name ?? '—'}
                />
              </section>
            </>
          )}
        </div>
      </aside>
    </>
  );
}

function DetailRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value ?? '—'}</span>
    </div>
  );
}
