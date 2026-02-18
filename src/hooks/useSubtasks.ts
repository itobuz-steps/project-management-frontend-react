import { useEffect, useState } from "react";
import type { TaskPopulated } from "../services/types/tasks.types";
import getTaskById, { updateTask } from "../services/taskService";

export function useSubtasks(task: TaskPopulated) {
  const [selectedIds, setSelectedIds] = useState<string[]>(
    (task.subTasks ?? []) as string[]
  );
  const [subtasks, setSubtasks] = useState<TaskPopulated[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedIds.length) {
      setSubtasks([]);
      return;
    }

    setLoading(true);
    Promise.all(selectedIds.map(getTaskById))
      .then(setSubtasks)
      .finally(() => setLoading(false));
  }, [selectedIds.join(',')]);

  const updateSubtask = (updated: TaskPopulated) => {
    setSubtasks((prev) =>
      prev.map((task) => (task._id === updated._id ? updated : task))
    );
  };

  const updateStatus = async (id: string, status: string) => {
    setSubtasks((prev) =>
      prev.map((task) => (task._id === id ? { ...task, status } : task))
    );
    await updateTask(id, { status });
  };

  const removeSubtask = async (id: string) => {
    const updatedIds = selectedIds.filter((task) => task !== id);

    setSelectedIds(updatedIds);
    setSubtasks((prev) => prev.filter((task) => task._id !== id));

    await updateTask(task._id, { subTasks: updatedIds });
    await updateTask(id, { parentTask: undefined });
  };

  return {
    selectedIds,
    setSelectedIds,
    subtasks,
    loading,
    updateSubtask,
    updateStatus,
    removeSubtask,
  };
}
