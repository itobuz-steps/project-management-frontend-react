import type { Sprint } from '../../services/types/sprints.types';
import type { TaskPopulated } from '../../services/types/tasks.types';

export interface TaskTableProps {
  sprint?: Sprint;
  setSprints?: React.Dispatch<React.SetStateAction<Sprint[]>>;
  tasks: TaskPopulated[];
  columns: string[];
  title?: string;
  containerId: string;
}
