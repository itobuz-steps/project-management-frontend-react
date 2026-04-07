import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getProjectById, updateProject } from '../services/projectService';
import { getTasks } from '../services/taskService';
import type { TaskPopulated } from '../services/types/tasks.types';
import type { Sprint } from '../services/types/sprints.types';
import { createSprintService } from '../services/sprints.service';
import { deleteProjectColumn } from '../services/projectService';
import type { Project } from '../types/project.types';
import type { BoardTaskFilters } from '../config/taskFilters';

export function useBoard(
  projectId?: string,
  searchInput = '',
  isScrum = false,
  filters: BoardTaskFilters = {}
) {
  const queryClient = useQueryClient();

  const [manualError, setError] = useState<string | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const sprintService = useMemo(
    () => (projectId ? createSprintService(projectId) : null),
    [projectId]
  );

  const projectQueryKey = useMemo(
    () => ['board', projectId, 'project'] as const,
    [projectId]
  );
  const tasksQueryKey = useMemo(
    () =>
      [
        'board',
        projectId,
        'tasks',
        searchInput,
        filters.type,
        filters.status,
        filters.priority,
        filters.assignee,
        filters.reporter,
        filters.tags,
        filters.sortBy,
        filters.sortOrder,
      ] as const,
    [
      projectId,
      searchInput,
      filters.type,
      filters.status,
      filters.priority,
      filters.assignee,
      filters.reporter,
      filters.tags,
      filters.sortBy,
      filters.sortOrder,
    ]
  );
  const sprintsQueryKey = useMemo(
    () => ['board', projectId, 'sprints'] as const,
    [projectId]
  );

  const projectQuery = useQuery({
    queryKey: projectQueryKey,
    queryFn: () => getProjectById(projectId as string),
    enabled: !!projectId,
  });

  const tasksQuery = useQuery({
    queryKey: tasksQueryKey,
    queryFn: () =>
      getTasks({
        projectId: projectId as string,
        searchInput,
        ...(filters.type ?? []),
        ...(filters.status ?? []),
        ...(filters.priority ?? []),
        ...(filters.assignee ?? []),
        ...(filters.reporter ?? []),
        ...(filters.tags ?? []),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      }),
    enabled: !!projectId,
  });

  const sprintsQuery = useQuery({
    queryKey: sprintsQueryKey,
    queryFn: () =>
      sprintService?.getSprints() ?? Promise.resolve([] as Sprint[]),
    enabled: !!projectId && isScrum,
  });

  const columns = useMemo(
    () => projectQuery.data?.columns ?? [],
    [projectQuery.data?.columns]
  );
  const tasks = tasksQuery.data ?? [];
  const sprints = isScrum ? (sprintsQuery.data ?? []) : [];
  const loading =
    !!projectId &&
    (projectQuery.isFetching ||
      tasksQuery.isFetching ||
      (isScrum && sprintsQuery.isFetching));

  const applyUpdater = <T>(current: T, next: React.SetStateAction<T>) =>
    typeof next === 'function' ? (next as (prevState: T) => T)(current) : next;

  const setTasks = useCallback(
    (next: React.SetStateAction<TaskPopulated[]>) => {
      queryClient.setQueryData<TaskPopulated[]>(tasksQueryKey, (prev = []) =>
        applyUpdater(prev, next)
      );
    },
    [queryClient, tasksQueryKey]
  );

  const setColumns = useCallback(
    (next: React.SetStateAction<string[]>) => {
      queryClient.setQueryData<Project | undefined>(projectQueryKey, (prev) => {
        if (!prev) {
          return prev;
        }

        return {
          ...prev,
          columns: applyUpdater(prev.columns ?? [], next),
        };
      });
    },
    [projectQueryKey, queryClient]
  );

  const setSprints = useCallback(
    (next: React.SetStateAction<Sprint[]>) => {
      queryClient.setQueryData<Sprint[]>(sprintsQueryKey, (prev = []) =>
        applyUpdater(prev, next)
      );
    },
    [queryClient, sprintsQueryKey]
  );

  useEffect(() => {
    const handler = (event: Event) => {
      const updated = (event as CustomEvent<TaskPopulated>).detail;
      if (!updated) {
        return;
      }
      setTasks((prev) =>
        prev.map((task) => (task._id === updated._id ? updated : task))
      );
    };
    window.addEventListener('task-updated', handler as EventListener);
    return () =>
      window.removeEventListener('task-updated', handler as EventListener);
  }, [setTasks]);

  const queryError =
    !!projectId &&
    (projectQuery.isError ||
      tasksQuery.isError ||
      (isScrum && sprintsQuery.isError))
      ? 'Failed to load tasks.'
      : null;

  const error = manualError ?? queryError;

  const handleAddColumn = useCallback(
    async (columnName: string, insertAfter?: string | null) => {
      const trimmed = columnName.trim();
      if (!trimmed) {
        throw new Error('Column name is required');
      }

      if (
        columns.some(
          (col) => col.toLowerCase().trim() === trimmed.toLowerCase().trim()
        )
      ) {
        throw new Error('Column already exists');
      }

      if (!projectId) {
        return;
      }

      const insertIndex = insertAfter
        ? columns.findIndex((col) => col === insertAfter)
        : -1;

      const nextColumns = [...columns];

      if (insertIndex >= 0) {
        nextColumns.splice(insertIndex + 1, 0, trimmed);
      } else {
        nextColumns.push(trimmed);
      }

      const formData = new FormData();
      nextColumns.forEach((col) => formData.append('columns[]', col));

      const updated = await updateProject(projectId, formData);

      const updatedColumns = updated.columns ?? nextColumns;
      queryClient.setQueryData<Project | undefined>(projectQueryKey, (prev) => {
        if (!prev) {
          return prev;
        }

        return {
          ...prev,
          columns: updatedColumns,
        };
      });

      return updatedColumns;
    },
    [columns, projectId, projectQueryKey, queryClient]
  );

  const handleDeleteColumn = async (columnName: string) => {
    if (!projectId) {
      return;
    }

    const res = await deleteProjectColumn(projectId, columnName);
    queryClient.setQueryData<Project | undefined>(projectQueryKey, (prev) => {
      if (!prev) {
        return prev;
      }

      return {
        ...prev,
        columns: res.result.columns,
      };
    });

    return res;
  };

  return {
    tasks,
    setTasks,
    columns,
    setColumns,
    sprints,
    setSprints,
    loading,
    error,
    setError,
    activeTaskId,
    setActiveTaskId,
    handleAddColumn,
    handleDeleteColumn,
  };
}

export default useBoard;
