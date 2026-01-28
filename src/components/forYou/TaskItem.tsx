import type { TaskPopulated } from '../../services/types/tasks.types';
import { TaskTypeIcon } from '../../utils/TaskTypeIcon';

export function TaskItem({ task }: { task: TaskPopulated }) {
  return (
    <li className="hover:bg-primary-50 flex items-center justify-between rounded-sm border border-gray-100 bg-white p-2 shadow-sm hover:cursor-pointer">
      <div className="flex items-center justify-start gap-2">
        <div className="flex items-center justify-center">
          <TaskTypeIcon type={task.type} />
        </div>
        <div className="flex flex-col items-start justify-center">
          <div className="flex gap-2">
            <p className="smaller-text bg-primary-500 m-auto w-max rounded-sm px-1 text-center font-semibold text-nowrap text-white">
              {task.key}
            </p>
            <p className="font-semibold">{task.title}</p>
          </div>
          <div className="flex items-center justify-center gap-3">
            <p className="smaller-text font-medium text-gray-500">
              {task.projectId.name}
            </p>
          </div>
        </div>
      </div>
      <p className="smaller-text flex gap-2 font-medium">
        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
      </p>
    </li>
  );
}
