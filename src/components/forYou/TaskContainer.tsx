import { useEffect, useState } from 'react';
import type { TaskPopulated } from '../../services/types/tasks.types';
import { getAllTasks } from '../../services/taskService';
import { StatusGroup } from './StatusGroup';

export function TaskContainer() {
  const [tasks, setTasks] = useState<TaskPopulated[]>([]);
  const [groupedTasks, setGroupedTasks] = useState<
    Record<string, TaskPopulated[]>
  >({});

  useEffect(() => {
    async function fetchTasks() {
      const res = await getAllTasks();
      const tasks = res;
      const groupedTasks: Record<string, TaskPopulated[]> = {};

      tasks.forEach((task) => {
        if (!groupedTasks[task.status]) {
          groupedTasks[task.status] = [];
        }
        groupedTasks[task.status].push(task);
      });
      setGroupedTasks(groupedTasks);
      setTasks(tasks);
    }
    fetchTasks();
  }, []);

  return (
    <div className="flex flex-col">
      <h2 className="flex w-full gap-1.5 border-b border-b-gray-400 pb-2 text-xl font-semibold dark:border-b-slate-700 dark:text-slate-100">
        Your Tasks
        <div className="h-5 w-5 rounded-full bg-gray-200 text-center text-sm text-black dark:bg-slate-700 dark:text-slate-100">
          {tasks.length}
        </div>
      </h2>
      <div className="flex h-full w-full flex-col gap-3 rounded-md">
        <div className="relative overflow-x-auto rounded-md" />
        {tasks.length === 0 && (
          <div
            className="flex w-full justify-center bg-gray-50 p-5 text-center font-semibold text-gray-400 dark:bg-slate-800 dark:text-slate-400"
            id="empty-for-you-container"
          >
            No tasks found!
          </div>
        )}

        {tasks.length > 0 &&
          Object.keys(groupedTasks).map((status) => (
            <StatusGroup
              key={status}
              status={status}
              tasks={groupedTasks[status]}
            />
          ))}
      </div>
    </div>
  );
}
