import type { Sprint } from "../../services/types/sprints.types";
import type { Task } from "../../types/tasks.types";

export interface TaskTableProps {
  sprint?: Sprint;
  tasks: Task[];
  columns: string[];
  title?: string;
}