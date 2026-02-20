import type { Sprint } from '../../services/types/sprints.types';
import type { TaskPopulated, User } from '../../services/types/tasks.types';

export interface TaskTableProps {
  sprint?: Sprint;
  setSprints?: React.Dispatch<React.SetStateAction<Sprint[]>>;
  tasks: TaskPopulated[];
  // setTasks: React.Dispatch<React.SetStateAction<TaskPopulated[]>>;
  columns: string[];
  title?: string;
  containerId: string;
}

export interface TaskRowProps {
  task: TaskPopulated;
  containerId: string;
  columns: string[];
  members: User[];
  loadingMembers: boolean;
  onUpdated: (t: TaskPopulated) => void;
}
