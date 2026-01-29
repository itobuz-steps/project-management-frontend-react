import type { Sprint } from '../../services/types/sprints.types';
import type { Task } from '../../types/tasks.types';

export interface TaskTableProps {
  sprint?: Sprint;
  setSprints?: React.Dispatch<React.SetStateAction<Sprint[]>>;
  tasks: Task[];
  columns: string[];
  title?: string;
  containerId: string;
}
