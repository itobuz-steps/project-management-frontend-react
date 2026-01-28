import type { Sprint } from '../../types/sprint.types';
import type { Task } from '../../types/tasks.types';

export interface TaskTableProps {
  sprint?: Sprint;
  tasks: Task[];
  columns: string[];
  title?: string;
  containerId: string;
}
