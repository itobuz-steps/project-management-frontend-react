import StatusBadge from './StatusBadge';
import type { TaskPopulated } from '../../services/types/tasks.types';

const TaskCard = ({ task }: { task: TaskPopulated }) => (
  <div className="group flex items-center justify-between gap-3 rounded border border-[#DCDFE4] bg-white px-3 py-2 text-sm transition-all duration-150">
    <div className="flex min-w-0 items-center gap-2">
      {/* Jira-style issue type icon */}
      <span className="flex h-2 w-2 flex-shrink-0 items-center justify-center rounded-sm bg-[#aeb4bb]"></span>
      <span className="truncate font-medium text-[#172B4D]">{task.title}</span>
    </div>
    <StatusBadge status={task.status} />
  </div>
);

export default TaskCard;
