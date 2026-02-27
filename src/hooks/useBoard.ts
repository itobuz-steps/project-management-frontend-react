import { useCallback, useEffect, useState } from 'react';
import { getProjectById, updateProject } from '../services/projectService';
import { getTasks } from '../services/taskService';
import type { TaskPopulated } from '../services/types/tasks.types';
import type { Sprint } from '../services/types/sprints.types';
import { createSprintService } from '../services/sprints.service';
import { deleteProjectColumn } from '../services/projectService';
import { message } from 'antd';

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

  const [newColumnName, setNewColumnName] = useState('');
  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);
  const [isSavingColumn, setIsSavingColumn] = useState(false);
  const [insertAfterColumn, setInsertAfterColumn] = useState<string | null>(
    null
  );
  const [isDeleteColumnOpen, setIsDeleteColumnOpen] = useState(false);
  const [columnToDelete, setColumnToDelete] = useState<string | null>(null);

  const sprintService = createSprintService(projectId as string);

  const openAddColumnModal = useCallback((columnId: string) => {
    setNewColumnName('');
    setInsertAfterColumn(columnId);
    setIsAddColumnOpen(true);
  }, []);

  const openDeleteColumnModal = useCallback(
    (columnId: string) => {
      const tasksInColumn = tasks.filter((task) => task.status === columnId);

      if (tasksInColumn.length > 0) {
        message.warning(
          `Cannot delete. ${tasksInColumn.length} task(s) exist in this column.`
        );
        return;
      }

      setColumnToDelete(columnId);
      setIsDeleteColumnOpen(true);
    },
    [tasks]
  );

  const handleAddColumn = useCallback(async () => {
    const trimmed = newColumnName.trim();
    if (!trimmed) {
      message.error('Column name is required.');
      return;
    }

    if (
      columns.some(
        (col) => col.toLowerCase().trim() === trimmed.toLowerCase().trim()
      )
    ) {
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
  }, [columns, insertAfterColumn, newColumnName, projectId]);

  const handleDeleteColumn = async (columnName: string) => {
    if (!projectId) return;

    try {
      setLoading(true);
      const res = await deleteProjectColumn(projectId, columnName);
      setColumns(res.result.columns);
      message.success(res.message);
    } catch {
      message.error('Failed to delete column');
    } finally {
      setLoading(false);
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
    newColumnName,
    setNewColumnName,
    isAddColumnOpen,
    setIsAddColumnOpen,
    isSavingColumn,
    insertAfterColumn,
    setInsertAfterColumn,
    isDeleteColumnOpen,
    setIsDeleteColumnOpen,
    columnToDelete,
    setColumnToDelete,
    openAddColumnModal,
    openDeleteColumnModal,
    handleAddColumn,
    handleDeleteColumn,
  };
}

export default useBoard;
