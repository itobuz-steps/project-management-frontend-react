import { useCallback, useEffect, useState } from 'react';
import { getProjectById, updateProject } from '../services/projectService';
import { getTasks } from '../services/taskService';
import type { TaskPopulated } from '../services/types/tasks.types';
import type { Sprint } from '../services/types/sprints.types';
import { createSprintService } from '../services/sprints.service';
import { deleteProjectColumn } from '../services/projectService';

export function useBoard(
  projectId?: string,
  searchInput = '',
  isScrum = false
) {
  const [tasks, setTasks] = useState<TaskPopulated[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const sprintService = createSprintService(projectId as string);

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
      setColumns(updatedColumns);

      return updatedColumns;
    },
    [columns, projectId]
  );

  const handleDeleteColumn = async (columnName: string) => {
    if (!projectId) {
      return;
    }

    const res = await deleteProjectColumn(projectId, columnName);
    setColumns(res.result.columns);
    return res;
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
          getTasks({ projectId, searchInput: searchInput || '' }),
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
  }, [isScrum, projectId, searchInput]);

  return {
    tasks,
    setTasks,
    columns,
    setColumns,
    sprints,
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
