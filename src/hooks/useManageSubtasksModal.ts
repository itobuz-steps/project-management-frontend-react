import { useState } from 'react';
import type { TaskPopulated } from '../services/types/tasks.types';
import { getTaskByProjectId } from '../services/taskService';

export function useManageSubtasks(task: TaskPopulated, projectId?: string) {
  const [open, setOpen] = useState(false);
  const [draftIds, setDraftIds] = useState<string[]>([]);
  const [projectTasks, setProjectTasks] = useState<TaskPopulated[]>([]);

  const openModal = async (selectedIds: string[]) => {
    setDraftIds(selectedIds);
    setOpen(true);

    const tasks = await getTaskByProjectId(
      (projectId as string) ?? task.projectId
    );
    setProjectTasks(
      tasks.filter((subtask: TaskPopulated) => subtask._id !== task._id)
    );
  };

  const closeModal = () => setOpen(false);

  return {
    open,
    draftIds,
    setDraftIds,
    projectTasks,
    setProjectTasks,
    openModal,
    closeModal,
  };
}
