import { useCallback, useEffect, useMemo, useState } from 'react';
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
import { message, Select, Skeleton, Tooltip } from 'antd';
import getTaskbyId, { updateTask } from '../../../services/taskService';
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
import { Minimize2, Maximize2, ChevronRight, User, Tag } from 'lucide-react';
import { useProjectMetaData } from '../../../hooks/useProjectMetaData';
import { useSprintActions } from '../../../hooks/useSprintActions';
import SprintModal from '../../sprintModal/SprintModal';
import { parseBoardTaskFilters } from '../../../config/taskFilters';

const { Option } = Select;

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
  const boardFilters = useMemo(
    () => parseBoardTaskFilters(searchParams),
    [searchParams]
  );

  const [collapsedLanes, setCollapsedLanes] = useState<Set<string>>(() => {
    try {
      const stored = sessionStorage.getItem('boardCollapsedLanes');
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });
  const toggleLane = (key: string) => {
    setCollapsedLanes((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      try {
        sessionStorage.setItem(
          'boardCollapsedLanes',
          JSON.stringify(Array.from(next))
        );
      } catch (error) {
        console.log('error', error);
      }
      return next;
    });
  };

  const {
    tasks,
    setTasks,
    columns,
    sprints,
    setSprints,
    loading,
    error,
    activeTaskId,
    setActiveTaskId,
    handleAddColumn,
    handleDeleteColumn,
    setError,
  } = useBoard(
    projectId,
    searchParams.get('searchInput') || '',
    isScrum,
    boardFilters
  );

  const { completeSprint } = useSprintActions(projectId, setSprints);
  const [isCompletingSprint, setIsCompletingSprint] = useState(false);
  const [completedSprintId, setCompletedSprintId] = useState<string | null>(
    null
  );

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

  const typeFilter = useMemo(() => {
    return (searchParams.get('type') || '')
      .split(',')
      .filter(Boolean)
      .map(normalize);
  }, [searchParams, normalize]);

  const rawGroupBy = searchParams.get('groupBy');
  const groupBy =
    rawGroupBy === 'assignee' || rawGroupBy === 'story' ? rawGroupBy : null;
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

  const activeSprint = useMemo(() => {
    if (!isScrum) return null;
    return (
      sprints.find((sprint) => sprint.dueDate && !sprint.isCompleted) ?? null
    );
  }, [isScrum, sprints]);

  const activeSprintTaskIds = useMemo(
    () => new Set(activeSprint?.tasks ?? []),
    [activeSprint]
  );

  const handleCompleteSprint = useCallback(async () => {
    if (!activeSprint || isCompletingSprint) {
      return;
    }

    setIsCompletingSprint(true);
    try {
      await completeSprint(activeSprint);
      setCompletedSprintId(activeSprint._id);
    } finally {
      setIsCompletingSprint(false);
    }
  }, [activeSprint, completeSprint, isCompletingSprint]);

  const visibleTasks = useMemo(() => {
    if (!isScrum) return tasks;
    if (!activeSprint) return [];
    return tasks.filter((task) => activeSprintTaskIds.has(task._id));
  }, [activeSprint, activeSprintTaskIds, isScrum, tasks]);

  const filteredVisibleTasks = useMemo(() => {
    if (
      !statusFilters.length &&
      !priorityFilters.length &&
      !assigneeFilters.length &&
      !typeFilter.length
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
      if (
        typeFilter.length &&
        !typeFilter.includes(normalize(task.type || ''))
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
    typeFilter,
  ]);

  const [storyGroupedTasks, setStoryGroupedTasks] = useState<
    {
      key: string;
      label: string | null;
      tasksByColumn: Record<string, TaskPopulated[]>;
    }[]
  >([]);

  useEffect(() => {
    let isCancelled = false;

    if (groupBy !== 'story') {
      setStoryGroupedTasks([]);
      return () => {
        isCancelled = true;
      };
    }

    const fetchStoryGroups = async () => {
      const buildTasksByStatus = (tasks: TaskPopulated[]) => {
        const tasksByStatus: Record<string, TaskPopulated[]> =
          Object.fromEntries(columns.map((col) => [col, []]));

        for (const task of tasks) {
          const col = tasksByStatus[task.status] ? task.status : columns[0];
          if (col) tasksByStatus[col].push(task);
        }

        return tasksByStatus;
      };

      const storyTasks = filteredVisibleTasks.filter(
        (task) => task.type === 'story'
      );

      const nonStoryTasks = filteredVisibleTasks.filter(
        (task) => task.type !== 'story' && !task.parentTask
      );

      const result: {
        key: string;
        label: string | null;
        tasksByColumn: Record<string, TaskPopulated[]>;
      }[] = [];

      for (const storyTask of storyTasks) {
        const taskGroupedByStatus: Record<string, TaskPopulated[]> =
          Object.fromEntries(columns.map((col) => [col, []]));

        for (const subTaskId of storyTask.subTasks || []) {
          try {
            const subTask = await getTaskbyId(subTaskId);
            const columnKey = taskGroupedByStatus[subTask.status]
              ? subTask.status
              : columns[0];
            if (columnKey) {
              taskGroupedByStatus[columnKey].push(subTask);
            }
          } catch {
            // Ignore failed subtask fetches to keep lane rendering resilient.
          }
        }

        result.push({
          key: storyTask._id,
          label: storyTask.title,
          tasksByColumn: taskGroupedByStatus,
        });
      }

      result.push({
        key: 'no-story',
        label: 'No Story',
        tasksByColumn: buildTasksByStatus(nonStoryTasks),
      });

      if (!isCancelled) {
        setStoryGroupedTasks(result);
      }
    };

    void fetchStoryGroups();

    return () => {
      isCancelled = true;
    };
  }, [columns, filteredVisibleTasks, groupBy]);

  const tasksByColumn = useMemo(() => {
    const map: Record<string, TaskPopulated[]> = {};

    columns.forEach((col) => {
      map[col] = [];
    });

    filteredVisibleTasks.forEach((task) => {
      if (map[task.status]) {
        map[task.status].push(task);
      } else if (columns.length) {
        map[columns[0]].push(task);
      }
    });

    return map;
  }, [columns, filteredVisibleTasks]);

  const activeTask = useMemo(
    () => tasks.find((task) => task._id === activeTaskId),
    [activeTaskId, tasks]
  );

  const groupedTasksByColumn = useMemo(() => {
    if (!groupBy) {
      return [{ key: 'all', label: null, tasksByColumn }];
    }

    const buildTasksByStatus = (tasks: TaskPopulated[]) => {
      const tasksByStatus: Record<string, TaskPopulated[]> = Object.fromEntries(
        columns.map((col) => [col, []])
      );

      for (const task of tasks) {
        const col = tasksByStatus[task.status] ? task.status : columns[0];
        if (col) tasksByStatus[col].push(task);
      }

      return tasksByStatus;
    };

    if (groupBy === 'assignee') {
      const laneMap = new Map<
        string,
        { label: string; tasks: TaskPopulated[] }
      >();

      for (const task of filteredVisibleTasks) {
        const key = task.assignee?._id ?? 'unassigned';
        const label = task.assignee?.name ?? 'Unassigned';

        if (!laneMap.has(key)) laneMap.set(key, { label, tasks: [] });
        laneMap.get(key)!.tasks.push(task);
      }

      const result = Array.from(laneMap.entries())
        .sort(([keyA, a], [keyB, b]) => {
          if (keyA === 'unassigned') return 1;
          if (keyB === 'unassigned') return -1;
          return a.label.localeCompare(b.label);
        })
        .map(([key, lane]) => ({
          key,
          label: lane.label,
          tasksByColumn: buildTasksByStatus(lane.tasks),
        }));

      console.log('grouped by assignee', result);

      return result;
    }

    if (groupBy === 'story') {
      return storyGroupedTasks;
    }

    return [{ key: 'all', label: null, tasksByColumn }];
  }, [
    groupBy,
    filteredVisibleTasks,
    columns,
    storyGroupedTasks,
    tasksByColumn,
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    })
  );

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

        if (!over || active.id === over.id) return;

        const activeColumn = active.data.current?.column as string | undefined;
        const overColumn =
          (over.data.current?.column as string | undefined) ??
          String(over.id).replace('column:', '');

        if (!activeColumn || !overColumn) return;

        const isStatusChange = activeColumn !== overColumn;
        let previousTasks: TaskPopulated[] = [];

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
            setTasks(previousTasks);
            setError('Failed to update task status.');
          });
        }
      }}
    >
      <div className="mb-3 flex justify-end gap-2">
        <Select
          placeholder={'Group'}
          value={groupBy || undefined}
          onChange={(val) => {
            setSearchParams((prev) => {
              const next = new URLSearchParams(prev);
              if (val) {
                next.set('groupBy', val);
              } else {
                next.delete('groupBy');
              }
              return next;
            });
          }}
          allowClear
          size="small"
          className="min-w-[140px]"
        >
          <Option value="">None</Option>
          <Option value="assignee">Assignee</Option>
          <Option value="story">Story</Option>
        </Select>

        {isScrum && activeSprint?.isStarted ? (
          <button
            type="button"
            onClick={handleCompleteSprint}
            disabled={isCompletingSprint}
            className="bg-primary-400 hover:bg-primary-500 inline-flex items-center justify-center rounded-md px-3 py-1.5 text-xs font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isCompletingSprint ? 'Completing...' : 'Complete Sprint'}
          </button>
        ) : null}

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

      <div className="flex flex-col gap-6">
        {groupedTasksByColumn.map(
          ({ key, label, tasksByColumn: laneColumns }) => {
            const isCollapsed = collapsedLanes.has(key);

            return (
              <div
                key={key}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-slate-700/60 dark:bg-slate-900"
              >
                {label && (
                  <button
                    onClick={() => toggleLane(key)}
                    className="group flex w-full items-center gap-3 bg-gray-50/80 px-5 py-3.5 text-left transition-colors hover:bg-gray-100/80 dark:bg-slate-800/60 dark:hover:bg-slate-800"
                  >
                    <ChevronRight
                      className={`h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200 group-hover:text-gray-600 dark:text-slate-500 dark:group-hover:text-slate-300 ${!isCollapsed ? 'rotate-90' : ''}`}
                    />
                    {groupBy === 'story' && (
                      <Tag className="h-4 w-4 shrink-0 text-green-400 dark:text-green-500" />
                    )}

                    {groupBy === 'assignee' &&
                      (key === 'unassigned' ? (
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-200 dark:bg-slate-700">
                          <User className="h-3.5 w-3.5 text-gray-400 dark:text-slate-500" />
                        </div>
                      ) : (
                        (() => {
                          const member = members.find((m) => m._id === key);
                          return member?.profileImage ? (
                            <img
                              src={member.profileImage}
                              alt={label ?? ''}
                              className="h-6 w-6 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-semibold text-violet-600 uppercase dark:bg-violet-900/40 dark:text-violet-400">
                              {label?.charAt(0)}
                            </div>
                          );
                        })()
                      ))}

                    <span className="text-sm font-semibold tracking-wide text-gray-800 dark:text-slate-100">
                      {label}
                    </span>

                    <span className="text-gray-300 dark:text-slate-600">·</span>

                    <span className="rounded-full bg-gray-200/80 px-2 py-0.5 text-xs font-medium text-gray-500 tabular-nums dark:bg-slate-700 dark:text-slate-400">
                      {Object.values(laneColumns).flat().length} tasks
                    </span>

                    <span className="ml-auto text-xs text-gray-400 opacity-0 transition-opacity group-hover:opacity-100 dark:text-slate-500">
                      {isCollapsed ? 'Expand' : 'Collapse'}
                    </span>
                  </button>
                )}

                {!isCollapsed && (
                  <div className="border-t border-gray-200/80 bg-white p-5 dark:border-slate-700/60 dark:bg-slate-900">
                    <div className="flex gap-4 overflow-x-auto pb-2 sm:gap-6">
                      {columns.map((col) => (
                        <Column
                          key={col}
                          col={col}
                          tasks={laneColumns[col] ?? []}
                          compactMode={isCompactMode}
                          loading={loading}
                          error={error}
                          onAdd={openAddColumnModal}
                          onDelete={openDeleteColumnModal}
                          onTaskOpen={(taskId: string) =>
                            setSearchParams((prev) => {
                              const next = new URLSearchParams(prev);
                              next.set('taskId', taskId);
                              return next;
                            })
                          }
                          onUpdated={handleTaskUpdated}
                          members={members}
                          loadingMembers={loadingMembers}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          }
        )}
      </div>

      <DragOverlay>
        {activeTaskId ? (
          <div className="rounded-md border border-gray-200 bg-white p-3 shadow-md dark:border-slate-700 dark:bg-slate-800">
            <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">
              {activeTask?.title}
              {activeTask ? (
                <span className="mt-1 flex items-center gap-1 text-xs text-gray-500 dark:text-slate-400">
                  <TaskTypeIcon type={activeTask.type} />
                  <TaskTypeColor type={activeTask.type}>
                    {activeTask.key ?? activeTaskId}
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

      {completedSprintId && projectId ? (
        <SprintModal
          visible={!!completedSprintId}
          onClose={() => setCompletedSprintId(null)}
          sprintId={completedSprintId}
          projectId={projectId}
        />
      ) : null}
    </DndContext>
  );
}

export default BoardView;
