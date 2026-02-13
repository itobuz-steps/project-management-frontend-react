import type { TaskPopulated } from "../services/types/tasks.types";

export const getProgressFromSubtasks = (
  subtasks: TaskPopulated[],
  columns: string[]
) => {
  if (!subtasks.length) return 0;

  const total = subtasks.length;

  const progressSum = subtasks.reduce((sum, task) => {
    const index = columns.indexOf(task.status);
    if (index === -1) return sum;

    const percent = (index / (columns.length - 1)) * 100;
    return sum + percent;
  }, 0);

  return Math.round(progressSum / total);
};
