import type { TaskPopulated } from '../../services/types/tasks.types';
import { TaskItem } from './TaskItem';

export function StatusGroup({
  status,
  tasks,
}: {
  status: string;
  tasks: TaskPopulated[];
}) {
  return (
    <div className="mb-2 flex w-full flex-col">
      <div className="flex items-center justify-between gap-2">
        <p className="my-2 font-semibold text-gray-500 uppercase dark:text-slate-400">
          {status}
        </p>
        <div className="w-4 rounded-full bg-gray-200 text-center text-[10px]! font-semibold text-black dark:bg-slate-700 dark:text-slate-100" />
      </div>
      <ul className="tasks-container flex flex-col gap-1">
        {tasks.map((task) => (
          <TaskItem key={task._id} task={task} />
        ))}
      </ul>
    </div>
  );
}
