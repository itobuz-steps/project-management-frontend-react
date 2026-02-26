import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { getTasks } from '../../services/taskService';
import type { TaskPopulated } from '../../services/types/tasks.types';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  value: string;
  onChange: (value: string) => void;
}

export function CommandPalette({
  open,
  onClose,
  value,
  onChange,
}: CommandPaletteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { projectId: routeProjectId } = useParams();
  const projectId = routeProjectId ?? searchParams.get('projectId');
  const type = searchParams.get('type');

  const [recentTasks, setRecentTasks] = useState<TaskPopulated[]>([]);
  const [searchResults, setSearchResults] = useState<TaskPopulated[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  // focus input when opened
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [open]);

  // fetch recently created tasks when palette opens
  useEffect(() => {
    if (!open || !projectId) return;

    let ignore = false;

    const fetchRecentTasks = async () => {
      setLoading(true);
      try {
        const tasks = await getTasks({ projectId });
        if (ignore) return;

        const recent = [...tasks]
          .filter((t) => t.createdAt)
          .sort(
            (a, b) =>
              new Date(b.createdAt!).getTime() -
              new Date(a.createdAt!).getTime()
          )
          .slice(0, 5);

        setRecentTasks(recent);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchRecentTasks();

    return () => {
      ignore = true;
    };
  }, [open, projectId]);

  // search tasks when value changes (debounced)
  useEffect(() => {
    if (!open || !projectId || !value.trim()) {
      setSearchResults([]);
      return;
    }

    let ignore = false;

    const fetchSearchResults = async () => {
      setSearchLoading(true);
      try {
        const tasks = await getTasks({ projectId, searchInput: value.trim() });
        if (!ignore) {
          setSearchResults(tasks);
        }
      } finally {
        if (!ignore) {
          setSearchLoading(false);
        }
      }
    };

    const timer = setTimeout(fetchSearchResults, 300);

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [open, projectId, value]);

  // esc to close
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Palette */}
      <div className="relative mx-auto mt-[20vh] w-full max-w-xl rounded-xl bg-white text-black shadow-2xl">
        <input
          ref={inputRef}
          type="search"
          placeholder="Search tasks by key, title, or description…"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-t-xl bg-white px-4 py-4 text-lg outline-none placeholder:text-neutral-400"
        />

        {/* RESULTS */}
        <div className="max-h-[360px] overflow-y-auto">
          {value.trim() === '' ? (
            <>
              <div className="px-4 py-2 text-xs font-semibold text-neutral-400 uppercase">
                Recently created
              </div>
              {loading && (
                <div className="px-4 py-3 text-sm text-neutral-400">
                  Loading…
                </div>
              )}
              {!loading && recentTasks.length === 0 && (
                <div className="px-4 py-3 text-sm text-neutral-400">
                  No recent tasks
                </div>
              )}
              {!loading &&
                recentTasks.map((task) => (
                  <button
                    key={task._id}
                    onClick={() => {
                      if (!projectId) return;
                      const next = new URLSearchParams(searchParams);
                      if (type) {
                        next.set('type', type);
                      } else {
                        next.delete('type');
                      }

                      navigate({
                        pathname: `/task/${task._id}`,
                        search: next.toString(),
                      });
                      onClose();
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-neutral-100"
                  >
                    <span className="rounded bg-neutral-200 px-2 py-0.5 font-mono text-xs">
                      {task.key}
                    </span>
                    <span className="truncate">{task.title}</span>
                  </button>
                ))}
            </>
          ) : (
            <>
              <div className="px-4 py-2 text-xs font-semibold text-neutral-400 uppercase">
                Search results
              </div>
              {searchLoading && (
                <div className="px-4 py-3 text-sm text-neutral-400">
                  Searching…
                </div>
              )}
              {!searchLoading && searchResults.length === 0 && (
                <div className="px-4 py-3 text-sm text-neutral-400">
                  No tasks found for "{value}"
                </div>
              )}
              {!searchLoading &&
                searchResults.map((task) => (
                  <button
                    key={task._id}
                    onClick={() => {
                      if (!projectId) return;
                      const next = new URLSearchParams(searchParams);
                      if (type) {
                        next.set('type', type);
                      } else {
                        next.delete('type');
                      }

                      navigate({
                        pathname: `/task/${task._id}`,
                        search: next.toString(),
                      });
                      onClose();
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-neutral-100"
                  >
                    <span className="rounded bg-neutral-200 px-2 py-0.5 font-mono text-xs">
                      {task.key}
                    </span>
                    <span className="truncate">{task.title}</span>
                  </button>
                ))}
            </>
          )}
        </div>

        <div className="border-t border-neutral-200 px-4 py-3 text-sm text-neutral-400">
          Press <kbd>Esc</kbd> to close
        </div>
      </div>
    </div>,
    document.body
  );
}
