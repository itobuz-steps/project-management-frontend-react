import { useCallback, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { message, Skeleton, Tooltip } from 'antd';
import { updateTask } from '../../../services/taskService';
import type {
  TaskPopulated,
  TaskStatus,
} from '../../../services/types/tasks.types';
import { TaskTypeIcon } from '../../../utils/TaskTypeIcon';
import { TaskTypeColor } from '../../../utils/TaskTypeColor';
import { useProject } from '../../../context/ProjectContext';
import { useSearchParams } from 'react-router-dom';
import useBoard from '../../../hooks/useBoard';
import Column from './Column';
import { AddColumnModal, DeleteColumnModal } from './ColumnModals';
import { Minimize2, Maximize2 } from 'lucide-react';
import { useProjectMetaData } from '../../../hooks/useProjectMetaData';

function BoardView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isCompactMode, setIsCompactMode] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');
  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);
  const [isSavingColumn, setIsSavingColumn] = useState(false);
  const [insertAfterColumn, setInsertAfterColumn] = useState<string | null>(
    null
  );

  const [isDeleteColumnOpen, setIsDeleteColumnOpen] = useState(false);
  const [columnToDelete, setColumnToDelete] = useState<string | null>(null);

  const { projectId } = useParams();
  const { project } = useProject();
  const { members, loadingMembers } = useProjectMetaData(projectId);

  const type = project?.projectType;
  const isScrum = type === 'scrum';

  const {
    tasks,
    setTasks,
    columns,
    sprints,
    loading,
    error,
    activeTaskId,
    setActiveTaskId,
    handleAddColumn,
    handleDeleteColumn,
    setError,
  } = useBoard(projectId, searchParams.get('searchInput') || '', isScrum);

  const handleTaskUpdated = useCallback(
    (updated: TaskPopulated) => {
      setTasks((prev) =>
        prev.map((task) => (task._id === updated._id ? updated : task))
      );
    },
    [setTasks]
  );

  const normalize = useCallback(
    (value?: string) => (value ?? '').toLowerCase().trim(),
    []
  );

  const statusFilters = useMemo(
    () =>
      (searchParams.get('status') || '')
        .split(',')
        .filter(Boolean)
        .map(normalize),
    [searchParams, normalize]
  );
  const priorityFilters = useMemo(
    () =>
      (searchParams.get('priority') || '')
        .split(',')
        .filter(Boolean)
        .map(normalize),
    [searchParams, normalize]
  );
  const assigneeFilters = useMemo(
    () =>
      (searchParams.get('assignee') || '')
        .split(',')
        .filter(Boolean)
        .map(normalize),
    [searchParams, normalize]
  );

  const openAddColumnModal = (columnId: string) => {
    setNewColumnName('');
    setInsertAfterColumn(columnId);
    setIsAddColumnOpen(true);
  };

  const openDeleteColumnModal = (columnId: string) => {
    const tasksInColumn = tasks.filter((task) => task.status === columnId);

    if (tasksInColumn.length) {
      message.warning(
        `Cannot delete. ${tasksInColumn.length} task(s) exist in this column.`
      );
      return;
    }

    setColumnToDelete(columnId);
    setIsDeleteColumnOpen(true);
  };

  const confirmAddColumn = async () => {
    try {
      setIsSavingColumn(true);

      await handleAddColumn(newColumnName, insertAfterColumn);

      message.success('Column added');
      setIsAddColumnOpen(false);
    } catch {
      message.error('Failed to add column');
    } finally {
      setIsSavingColumn(false);
    }
  };

  const confirmDeleteColumn = async () => {
    if (!columnToDelete) return;

    try {
      await handleDeleteColumn(columnToDelete);
      message.success('Column deleted');
    } catch {
      message.error('Failed to delete column');
    } finally {
      setIsDeleteColumnOpen(false);
      setColumnToDelete(null);
    }
  };

  const sprintTaskIds = useMemo(() => {
    if (!isScrum) {
      return null;
    }

    const activeSprint = sprints.find(
      (sprint) => sprint.dueDate && !sprint.isCompleted
    );

    if (!activeSprint) {
      return new Set<string>();
    }

    return new Set(activeSprint.tasks);
  }, [isScrum, sprints]);

  const visibleTasks = useMemo(() => {
    if (!isScrum) {
      return tasks;
    }
    if (!sprintTaskIds || sprintTaskIds.size === 0) {
      return [];
    }

    return tasks.filter((task) => sprintTaskIds.has(task._id));
  }, [isScrum, sprintTaskIds, tasks]);

  const filteredVisibleTasks = useMemo(() => {
    if (
      !statusFilters.length &&
      !priorityFilters.length &&
      !assigneeFilters.length
    ) {
      return visibleTasks;
    }

    return visibleTasks.filter((task) => {
      if (
        statusFilters.length &&
        !statusFilters.includes(normalize(task.status))
      ) {
        return false;
      }
      if (
        priorityFilters.length &&
        !priorityFilters.includes(normalize(task.priority))
      ) {
        return false;
      }
      if (
        assigneeFilters.length &&
        !assigneeFilters.includes(normalize(task.assignee?._id || ''))
      ) {
        return false;
      }
      return true;
    });
  }, [
    priorityFilters,
    statusFilters,
    assigneeFilters,
    normalize,
    visibleTasks,
  ]);

  const tasksByColumn = useMemo(() => {
    const map: Record<string, TaskPopulated[]> = {};

    columns.forEach((col) => {
      map[col] = [];
    });

    filteredVisibleTasks.forEach((task) => {
      if (map[task.status]) {
        map[task.status].push(task);
      } else if (columns.length) {
        // fallback to first column
        map[columns[0]].push(task);
      }
    });

    return map;
  }, [columns, filteredVisibleTasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    })
  );
  // hook handles loading/initial load and column add/delete

  if (!projectId) {
    return (
      <div className="bg-primary-50 rounded-lg border p-6 text-center text-gray-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
        <h2 className="mb-2 text-lg font-semibold text-gray-700 dark:text-slate-200">
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

        if (!over) {
          return;
        }
        if (active.id === over.id) {
          return;
        }

        const activeColumn = active.data.current?.column as string | undefined;
        const overColumn =
          (over.data.current?.column as string | undefined) ??
          (typeof over.id === 'string' && over.id.startsWith('column:')
            ? over.id.replace('column:', '')
            : undefined);

        if (!activeColumn || !overColumn) {
          return;
        }

        const isStatusChange = activeColumn !== overColumn;
        let previousTasks: TaskPopulated[] | null = null;

        setTasks((prev) => {
          previousTasks = prev;
          const activeIndex = prev.findIndex((task) => task._id === active.id);
          if (activeIndex === -1) {
            return prev;
          }

          const updated = [...prev];
          updated[activeIndex] = {
            ...updated[activeIndex],
            status: overColumn as TaskStatus,
          };

          if (!isStatusChange) {
            const overIndex = updated.findIndex((task) => task._id === over.id);
            if (overIndex === -1) {
              return updated;
            }
            return arrayMove(updated, activeIndex, overIndex);
          }

          return updated;
        });

        if (isStatusChange) {
          void updateTask(String(active.id), {
            status: overColumn as TaskStatus,
          }).catch(() => {
            if (previousTasks) {
              setTasks(previousTasks);
            }
            setError('Failed to update task status.');
          });
        }
      }}
    >
      <div className="mb-3 flex justify-end">
        <Tooltip
          title={
            isCompactMode ? 'Switch to expanded view' : 'Switch to compact view'
          }
          placement="left"
        >
          <button
            type="button"
            onClick={() => setIsCompactMode((prev) => !prev)}
            aria-label={
              isCompactMode
                ? 'Switch to expanded view'
                : 'Switch to compact view'
            }
            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-gray-300 text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            {isCompactMode ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
          </button>
        </Tooltip>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 sm:gap-6">
        {columns.map((col) => (
          <Column
            key={col}
            col={col}
            tasks={tasksByColumn[col] ?? []}
            compactMode={isCompactMode}
            loading={loading}
            error={error}
            onAdd={openAddColumnModal}
            onDelete={openDeleteColumnModal}
            onTaskOpen={(taskId: string) => setSearchParams({ taskId })}
            onUpdated={handleTaskUpdated}
            members={members}
            loadingMembers={loadingMembers}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTaskId ? (
          <div className="rounded-md border border-gray-200 bg-white p-3 shadow-md dark:border-slate-700 dark:bg-slate-800">
            <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">
              {tasks.find((task) => task._id === activeTaskId)?.title}
              {tasks.find((task) => task._id === activeTaskId) ? (
                <span className="mt-1 flex items-center gap-1 text-xs text-gray-500 dark:text-slate-400">
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

      <AddColumnModal
        open={isAddColumnOpen}
        value={newColumnName}
        onChange={(e) => setNewColumnName(e.target.value)}
        onCancel={() => setIsAddColumnOpen(false)}
        onOk={confirmAddColumn}
        confirmLoading={isSavingColumn}
      />

      <DeleteColumnModal
        open={isDeleteColumnOpen}
        columnName={columnToDelete}
        onCancel={() => {
          setIsDeleteColumnOpen(false);
          setColumnToDelete(null);
        }}
        onOk={confirmDeleteColumn}
      />
    </DndContext>
  );
}

export default BoardView;
