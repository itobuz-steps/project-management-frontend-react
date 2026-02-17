import type { Sprint } from '../../services/types/sprints.types';
import type { TaskPopulated, User } from '../../services/types/tasks.types';

export interface TaskTableProps {
  sprint?: Sprint;
  setSprints?: React.Dispatch<React.SetStateAction<Sprint[]>>;
  tasks: TaskPopulated[];
  columns: string[];
  title?: string;
  containerId: string;
}

export interface TaskRowProps{
  task: TaskPopulated;
  containerId: string;
  columns: string[];
  onPatch: (id: string, patch: Partial<TaskPopulated>) => void;
  members: User[];
  loadingMembers: boolean;
  onUpdated: (t: TaskPopulated) => void;
}