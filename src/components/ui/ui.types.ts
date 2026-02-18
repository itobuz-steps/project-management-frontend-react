import type { TaskPopulated, User } from '../../services/types/tasks.types';

export type AssigneeCellType = {
  task: TaskPopulated;
  members: User[];
  loading: boolean;
  onUpdated: (t: TaskPopulated) => void;
  loadMembers?: () => void;
};

export type DueDateCellType = {
  dueDate?: string;
  onChange: (date: string) => void;
};

export type SidebarRowType = {
  label?: string;
  children: React.ReactNode;
};

export type StatusSelectType = {
  value: string;
  columns: string[];
  onChange: (value: string) => void;
  className?: string;
};

export type TaskKeyCellType = {
  taskId: string;
  type: string;
  taskKey: string;
};

export type TaskTitleCellType = {
  title: string;
  taskId: string;
};

export type UserCellType = {
  user?: User;
  emptyText: string;
};
