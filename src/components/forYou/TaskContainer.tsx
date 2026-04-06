import { useEffect, useRef, useState, useCallback } from 'react';
import type { TaskPopulated } from '../../services/types/tasks.types';
import { getTasksPaginated } from '../../services/taskService';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TaskItem } from './TaskItem'; // replace with your actual task card component

interface TaskContainerProps {
  projectId: string;
}

export function TaskContainer({ projectId }: TaskContainerProps) {
  const [tasks, setTasks] = useState<TaskPopulated[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const hasBeenVisibleRef = useRef(false);

  const fetchTasks = useCallback(async (pageToFetch: number) => {
    setLoading(true);
    try {
      const res = await getTasksPaginated({
        page: pageToFetch,
        limit: 10,
      });
      setTasks(res.data);
      setTotalPages(res.pagination.totalPages);
      setTotal(res.pagination.total);
      setPage(pageToFetch);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setTasks([]);
    setPage(1);
    setTotalPages(0);
    setTotal(0);
    hasBeenVisibleRef.current = false;
  }, [projectId]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasBeenVisibleRef.current) {
          hasBeenVisibleRef.current = true;
          fetchTasks(1);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchTasks]);

  return (
    <div ref={containerRef} className="flex flex-col">
      <h2 className="flex w-full items-center gap-1.5 border-b border-b-gray-400 pb-2 text-xl font-semibold dark:border-b-slate-700 dark:text-slate-100">
        Your Tasks
        <div className="h-5 w-5 rounded-full bg-gray-200 text-center text-sm text-black dark:bg-slate-700 dark:text-slate-100">
          {total}
        </div>
      </h2>

      <div className="flex h-full w-full flex-col gap-2 rounded-md">
        {loading && (
          <div className="flex w-full justify-center p-5 text-gray-400 dark:text-slate-400">
            Loading...
          </div>
        )}

        {!loading && tasks.length === 0 && (
          <div className="flex w-full justify-center bg-gray-50 p-5 text-center font-semibold text-gray-400 dark:bg-slate-800 dark:text-slate-400">
            No tasks found!
          </div>
        )}

        {!loading &&
          tasks.map((task) => <TaskItem key={task._id} task={task} />)}

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 pt-3 dark:border-slate-700">
            <span className="text-xs text-gray-400 dark:text-slate-500">
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => fetchTasks(page - 1)}
                disabled={page === 1 || loading}
                className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
                aria-label="Previous page"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={() => fetchTasks(page + 1)}
                disabled={page === totalPages || loading}
                className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
                aria-label="Next page"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
