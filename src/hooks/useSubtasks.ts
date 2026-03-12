import { useEffect, useState } from 'react';
import type { TaskPopulated } from '../services/types/tasks.types';
import getTaskById, { updateTask } from '../services/taskService';
import { message } from 'antd';

export function useSubtasks(task: TaskPopulated) {
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
    try {
      await updateTask(id, { status });
      message.success('Subtask status updated.');
    } catch {
      message.error('Failed to update subtask status.');
    }
  };

  const removeSubtask = async (id: string) => {
    const updatedIds = selectedIds.filter((task) => task !== id);

    setSelectedIds(updatedIds);
    setSubtasks((prev) => prev.filter((task) => task._id !== id));

    try {
      await Promise.all([
        updateTask(task._id, { subTasks: updatedIds }),
        updateTask(id, { parentTask: null }),
      ]);
    } catch {
      message.error('Failed to remove task');
    }
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
