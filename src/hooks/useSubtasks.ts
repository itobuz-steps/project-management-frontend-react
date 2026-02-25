import { useEffect, useState } from 'react';
import type { TaskPopulated } from '../services/types/tasks.types';
import getTaskById, { updateTask } from '../services/taskService';
import { message } from 'antd';

export function useSubtasks(task: TaskPopulated) {
  console.log('useSubtasks', { task });
  const [selectedIds, setSelectedIds] = useState<string[]>(
    (task.subTasks ?? []) as string[]
  );
  const [subtasks, setSubtasks] = useState<TaskPopulated[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchSubtasks() {
      if (!selectedIds.length) {
        setSubtasks([]);
        return;
      }

      setLoading(true);
      try {
        const data = await Promise.all(selectedIds.map(getTaskById));
        setSubtasks(data);
      } catch {
        message.error('Failed to get tasks');
      } finally {
        setLoading(false);
      }
    }

    fetchSubtasks();
  }, [selectedIds]);

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
