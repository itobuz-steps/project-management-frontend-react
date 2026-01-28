import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  closestCorners,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { fetchWithAuth } from '../api/interceptor';
import { getProjectById } from '../../services/projects.service';
import { getTasks, updateTask } from '../../services/tasks.service';
import type { Task, TaskStatus } from '../../services/types/tasks.types';
import type { Sprint } from '../../types/sprint.types';
import { TaskTypeIcon } from '../../utils/TaskTypeIcon';
import { TaskTypeColor } from '../../utils/TaskTypeColor';

function TaskCard({ task, column }: { task: Task; column: string }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task._id, data: { type: 'task', column } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-md border border-gray-100 bg-white p-3 shadow-sm ${
        isDragging ? 'opacity-50' : ''
      }`}
      {...attributes}
      {...listeners}
    >
      <p className="text-sm font-semibold text-gray-900">{task.title}</p>
      <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
        <TaskTypeIcon type={task.type} />
        <TaskTypeColor type={task.type}>{task.key ?? task._id}</TaskTypeColor>
      </p>
    </div>
  );
}

function ColumnDropZone({ id, children }: { id: string; children: ReactNode }) {
  const { setNodeRef } = useDroppable({
    id: `column:${id}`,
    data: { type: 'column', column: id },
  });

  return (
    <div ref={setNodeRef} className={`min-h-[120px] rounded-md`}>
      {children}
    </div>
  );
}

function BoardView() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const projectId = searchParams.get('projectId');
  const type = searchParams.get('type');
  const isScrum = type === 'scrum';

  const [tasks, setTasks] = useState<Task[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const normalize = (value?: string) => (value ?? '').toLowerCase().trim();

  const sprintTaskIds = useMemo(() => {
    if (!isScrum) return null;

    return new Set(
      sprints.filter((sprint) => !sprint.isCompleted).flatMap((s) => s.tasks)
    );
  }, [isScrum, sprints]);

  const visibleTasks = useMemo(() => {
    if (!isScrum) return tasks;
    if (!sprintTaskIds || sprintTaskIds.size === 0) return [];

    return tasks.filter((task) => sprintTaskIds.has(task._id));
  }, [isScrum, sprintTaskIds, tasks]);

  const tasksByColumn = useMemo(() => {
    const map = columns.reduce<Record<string, Task[]>>((acc, col) => {
      acc[col] = [];
      return acc;
    }, {});

    visibleTasks.forEach((task) => {
      const match = columns.find(
        (col) => normalize(col) === normalize(task.status)
      );

      if (match) {
        map[match].push(task);
      } else if (columns.length > 0) {
        map[columns[0]].push(task);
      }
    });

    return map;
  }, [columns, normalize, visibleTasks]);

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    if (!projectId) {
      setColumns([]);
      setTasks([]);
      setSprints([]);
      setLoading(false);
      setError(null);
      return;
    }

    let isMounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const [projectResp, tasksResp, sprintsResp] = await Promise.all([
          getProjectById(projectId),
          getTasks({ projectId }),
          isScrum
            ? fetchWithAuth<{ result?: Sprint[] } | Sprint[]>('/sprint', {
                params: { projectId },
              })
            : Promise.resolve([] as Sprint[]),
        ]);

        const project =
          typeof projectResp === 'object' && projectResp
            ? ((projectResp as { result?: { columns?: string[] } }).result ??
              projectResp)
            : projectResp;

        const projectColumns =
          (project as { columns?: string[] })?.columns ?? [];

        const taskPayload = Array.isArray(tasksResp)
          ? tasksResp
          : ((tasksResp as { result?: Task[] }).result ?? []);

        const sprintPayload = Array.isArray(sprintsResp)
          ? sprintsResp
          : ((sprintsResp as { result?: Sprint[] }).result ?? []);

        if (isMounted) {
          setColumns(projectColumns);
          setTasks(taskPayload);
          setSprints(sprintPayload);
        }
      } catch {
        if (isMounted) setError('Failed to load tasks.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [isScrum, projectId]);

  if (!projectId) {
    return (
      <div className="rounded-lg border bg-blue-50 p-6 text-center text-gray-500">
        <h2 className="mb-2 text-lg font-semibold text-gray-700">
          No project selected
        </h2>
        <p className="text-sm">
          Select a project from the sidebar to view its board.
        </p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={(event) => setActiveTaskId(String(event.active.id))}
      onDragEnd={({ active, over }) => {
        setActiveTaskId(null);

        if (!over) return;
        if (active.id === over.id) return;

        const activeColumn = active.data.current?.column as string | undefined;
        const overColumn =
          (over.data.current?.column as string | undefined) ??
          (typeof over.id === 'string' && over.id.startsWith('column:')
            ? over.id.replace('column:', '')
            : undefined);

        if (!activeColumn || !overColumn) return;

        const isStatusChange = activeColumn !== overColumn;
        let previousTasks: Task[] | null = null;

        setTasks((prev) => {
          previousTasks = prev;
          const activeIndex = prev.findIndex((task) => task._id === active.id);
          if (activeIndex === -1) return prev;

          const updated = [...prev];
          updated[activeIndex] = {
            ...updated[activeIndex],
            status: overColumn as TaskStatus,
          };

          if (!isStatusChange) {
            const overIndex = updated.findIndex((task) => task._id === over.id);
            if (overIndex === -1) return updated;
            return arrayMove(updated, activeIndex, overIndex);
          }

          return updated;
        });

        if (isStatusChange) {
          void updateTask(String(active.id), {
            status: overColumn as TaskStatus,
          }).catch(() => {
            if (previousTasks) setTasks(previousTasks);
            setError('Failed to update task status.');
          });
        }
      }}
    >
      <div className="flex gap-4 overflow-x-auto pb-2 sm:gap-6">
        {columns.map((col) => (
          <div key={col} className="w-72 shrink-0">
            <div className="h-full rounded-lg border bg-blue-50 shadow-sm">
              <div className="sticky top-0 z-10 flex items-center gap-2 border-b bg-white px-4 py-2">
                <h2 className="text-sm font-semibold text-gray-900 uppercase">
                  {col}
                </h2>
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-900">
                  {tasksByColumn[col]?.length ?? 0}
                </span>
              </div>

              <ColumnDropZone id={col}>
                <SortableContext
                  items={(tasksByColumn[col] ?? []).map((task) => task._id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="flex flex-col gap-3 p-3">
                    {loading && (
                      <div className="rounded-md border border-dashed border-gray-200 bg-gray-50 p-3 text-sm text-gray-500">
                        Loading tasks...
                      </div>
                    )}

                    {error && (
                      <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                        {error}
                      </div>
                    )}

                    {!loading && !error && tasksByColumn[col]?.length === 0 && (
                      <div className="rounded-md border border-dashed border-gray-200 bg-gray-50 p-3 text-sm text-gray-500">
                        No tasks
                      </div>
                    )}

                    {!loading &&
                      !error &&
                      tasksByColumn[col]?.map((task) => (
                        <div
                          key={task._id}
                          onClick={() => {
                            const params = new URLSearchParams(location.search);
                            params.set('taskId', task._id);
                            navigate({
                              pathname: location.pathname,
                              search: params.toString(),
                            });
                          }}
                        >
                          <TaskCard task={task} column={col} />
                        </div>
                      ))}
                  </div>
                </SortableContext>
              </ColumnDropZone>
            </div>
          </div>
        ))}
      </div>

      <DragOverlay>
        {activeTaskId ? (
          <div className="rounded-md border border-gray-200 bg-white p-3 shadow-md">
            <p className="text-sm font-semibold text-gray-900">
              {tasks.find((task) => task._id === activeTaskId)?.title}
              {tasks.find((task) => task._id === activeTaskId) ? (
                <span className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                  <TaskTypeIcon
                    type={
                      tasks.find((task) => task._id === activeTaskId)?.type ||
                      'task'
                    }
                  />

                  <TaskTypeColor
                    type={
                      tasks.find((task) => task._id === activeTaskId)?.type ||
                      'task'
                    }
                  >
                    {tasks.find((task) => task._id === activeTaskId)?.key ??
                      activeTaskId}
                  </TaskTypeColor>
                </span>
              ) : null}
            </p>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default BoardView;
