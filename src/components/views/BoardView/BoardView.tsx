import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useParams } from 'react-router-dom';
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
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Input, message, Modal, Skeleton } from 'antd';
import {
  getProjectById,
  updateProject,
} from '../../../services/projectService';
import { getTasks } from '../../../services/taskService';
import { updateTask } from '../../../services/taskService';
import type {
  TaskPopulated,
  TaskStatus,
} from '../../../services/types/tasks.types';
import type { Sprint } from '../../../services/types/sprints.types';
import { TaskTypeIcon } from '../../../utils/TaskTypeIcon';
import { TaskTypeColor } from '../../../utils/TaskTypeColor';
import { useProject } from '../../../context/ProjectContext';
import { useSearchParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { createSprintService } from '../../../services/sprints.service';
import { TaskCard } from './TaskCard';
import { Can } from '../../../utils/PermissionHoc';

function ColumnDropZone({ id, children }: { id: string; children: ReactNode }) {
  const { setNodeRef } = useDroppable({
    id: `column:${id}`,
    data: { type: 'column', column: id },
  });

  return (
    <div ref={setNodeRef} className={`min-h-30 rounded-md`}>
      {children}
    </div>
  );
}

function BoardView() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { projectId } = useParams();
  const { project } = useProject();
  const sprintService = createSprintService(projectId as string);
  const type = project?.projectType;
  const isScrum = type === 'scrum';

  const [tasks, setTasks] = useState<TaskPopulated[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');
  const [isSavingColumn, setIsSavingColumn] = useState(false);
  const [insertAfterColumn, setInsertAfterColumn] = useState<string | null>(
    null
  );

  const normalize = useCallback(
    (value?: string) => (value ?? '').toLowerCase().trim(),
    []
  );

  const statusFilter = normalize(searchParams.get('status') || '');
  const priorityFilter = normalize(searchParams.get('priority') || '');

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

  const filteredVisibleTasks = useMemo(() => {
    if (!statusFilter && !priorityFilter) return visibleTasks;

    return visibleTasks.filter((task) => {
      if (statusFilter && normalize(task.status) !== statusFilter) {
        return false;
      }
      if (priorityFilter && normalize(task.priority) !== priorityFilter) {
        return false;
      }
      return true;
    });
  }, [priorityFilter, statusFilter, normalize, visibleTasks]);

  const tasksByColumn = useMemo(() => {
    const map = columns.reduce<Record<string, TaskPopulated[]>>((acc, col) => {
      acc[col] = [];
      return acc;
    }, {});

    filteredVisibleTasks.forEach((task) => {
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
  }, [columns, normalize, filteredVisibleTasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    })
  );

  const openAddColumnModal = (columnId: string) => {
    setNewColumnName('');
    setInsertAfterColumn(columnId);
    setIsAddColumnOpen(true);
  };

  const handleAddColumn = async () => {
    const trimmed = newColumnName.trim();
    if (!trimmed) {
      message.error('Column name is required.');
      return;
    }

    if (columns.some((col) => normalize(col) === normalize(trimmed))) {
      message.error('Column already exists.');
      return;
    }

    if (!projectId) return;

    try {
      setIsSavingColumn(true);
      const insertIndex = insertAfterColumn
        ? columns.findIndex((col) => col === insertAfterColumn)
        : -1;

      const nextColumns = [...columns];
      if (insertIndex >= 0) {
        nextColumns.splice(insertIndex + 1, 0, trimmed);
      } else {
        nextColumns.push(trimmed);
      }

      const updated = await updateProject(projectId, {
        columns: nextColumns,
      });

      const updatedColumns = updated.columns ?? nextColumns;
      setColumns(updatedColumns);
      message.success('Column added.');
      setIsAddColumnOpen(false);
    } catch {
      message.error('Failed to add column.');
    } finally {
      setIsSavingColumn(false);
    }
  };

  useEffect(() => {
    if (!projectId) {
      setColumns([]);
      setTasks([]);
      setSprints([]);
      setLoading(false);
      setError(null);
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const [project, tasksResp, sprintsResp] = await Promise.all([
          getProjectById(projectId),
          getTasks({
            projectId,
            searchInput: searchParams.get('searchInput') || '',
          }),
          isScrum
            ? sprintService.getSprints()
            : Promise.resolve([] as Sprint[]),
        ]);

        const projectColumns = project.columns;

        const taskPayload = Array.isArray(tasksResp)
          ? tasksResp
          : ((tasksResp as { result?: TaskPopulated[] }).result ?? []);

        const sprintPayload = Array.isArray(sprintsResp)
          ? sprintsResp
          : ((sprintsResp as { result?: Sprint[] }).result ?? []);

        setColumns(projectColumns);
        setTasks(taskPayload);
        setSprints(sprintPayload);
      } catch {
        setError('Failed to load tasks.');
      } finally {
        setLoading(false);
      }
    };

    load();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScrum, projectId, searchParams.get('searchInput')]);

  if (!projectId) {
    return (
      <div className="bg-primary-50 rounded-lg border p-6 text-center text-gray-500">
        <h2 className="mb-2 text-lg font-semibold text-gray-700">
          No project selected
        </h2>
        <p className="text-sm">
          Select a project from the sidebar to view its board.
        </p>
      </div>
    );
  }

  return loading ? (
    <div className="flex gap-3 overflow-x-auto">
      <div className="flex flex-col gap-1">
        <Skeleton.Node
          active={true}
          style={{ width: '16rem', height: '40px' }}
        />
        <Skeleton.Node
          active={true}
          style={{ width: '16rem', height: '400px' }}
        />
      </div>
      <div className="flex flex-col gap-1">
        <Skeleton.Node
          active={true}
          style={{ width: '16rem', height: '40px' }}
        />
        <Skeleton.Node
          active={true}
          style={{ width: '16rem', height: '400px' }}
        />
      </div>
      <div className="flex flex-col gap-1">
        <Skeleton.Node
          active={true}
          style={{ width: '16rem', height: '40px' }}
        />
        <Skeleton.Node
          active={true}
          style={{ width: '16rem', height: '400px' }}
        />
      </div>
    </div>
  ) : (
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
        let previousTasks: TaskPopulated[] | null = null;

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
            <div className="h-full rounded-lg bg-[#f8f8f8] shadow-sm">
              <div className="sticky top-0 z-10 flex items-center justify-between gap-2 px-4 py-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold text-gray-600 uppercase">
                    {col}
                  </h2>
                  <span className="rounded-full bg-gray-300 px-2 py-0.5 text-xs font-semibold text-gray-900">
                    {tasksByColumn[col]?.length ?? 0}
                  </span>
                </div>
                <Can permission="ADD_COLUMN">
                  <button
                    type="button"
                    aria-label="Add column"
                    className="rounded p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                    onClick={() => {
                      openAddColumnModal(col);
                    }}
                  >
                    <Plus size={16} />
                  </button>
                </Can>
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
                        <TaskCard
                          key={task._id}
                          task={task}
                          column={col}
                          onOpen={() => {
                            setSearchParams({ taskId: task._id });
                          }}
                        />
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

      <Modal
        open={isAddColumnOpen}
        title="Add column"
        onCancel={() => setIsAddColumnOpen(false)}
        onOk={handleAddColumn}
        confirmLoading={isSavingColumn}
        destroyOnHidden
      >
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            Column name
          </label>
          <Input
            placeholder="e.g. In Review"
            value={newColumnName}
            onChange={(event) => setNewColumnName(event.target.value)}
            onPressEnter={handleAddColumn}
          />
        </div>
      </Modal>
    </DndContext>
  );
}

export default BoardView;
