import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { TaskPopulated } from '../services/types/tasks.types';
import { getTaskByProjectId } from '../services/taskService';

export function useManageSubtasks(task: TaskPopulated, projectId?: string) {
  const [open, setOpen] = useState(false);
  const [draftIds, setDraftIds] = useState<string[]>([]);
  const queryClient = useQueryClient();

  const resolvedProjectId = (projectId as string) ?? task.projectId;
  const queryKey = ['tasks', 'project', resolvedProjectId];

  const projectTasksQuery = useQuery({
    queryKey,
    queryFn: () => getTaskByProjectId(resolvedProjectId),
    enabled: open && !!resolvedProjectId,
  });

  const projectTasks = (projectTasksQuery.data ?? []).filter(
    (subtask: TaskPopulated) => subtask._id !== task._id
  );

  const setProjectTasks: React.Dispatch<
    React.SetStateAction<TaskPopulated[]>
  > = (value) => {
    queryClient.setQueryData<TaskPopulated[]>(queryKey, (prev = []) =>
      typeof value === 'function'
        ? (value as (prev: TaskPopulated[]) => TaskPopulated[])(prev)
        : value
    );
  };

  const openModal = (selectedIds: string[]) => {
    setDraftIds(selectedIds);
    setOpen(true);
  };

  const closeModal = () => setOpen(false);

  return {
    open,
    draftIds,
    setDraftIds,
    projectTasks,
    setProjectTasks,
    loading: projectTasksQuery.isFetching,
    openModal,
    closeModal,
  };
}
