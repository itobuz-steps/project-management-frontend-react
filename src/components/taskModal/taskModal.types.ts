import type { TaskPopulated } from '../../services/types/tasks.types';

export type EditingField = 'priority' | 'type' | null;

export interface TaskModalProps {
  taskId: string;
  onClose: () => void;
}

export type ViewProps = {
  task: TaskPopulated;
  isMobile: boolean;
  onUpdated: (t: TaskPopulated) => void;
  loading?: boolean;
};

export type HeaderProps = {
  task: TaskPopulated;
  onUpdated: (t: TaskPopulated) => void;
  onClose?: () => void;
  page: boolean;
};

export type TaskDescriptionProps = {
  task: TaskPopulated;
  onUpdated?: (updated: TaskPopulated) => void;
};

export type TaskDetailsProps = {
  task: TaskPopulated;
  onUpdated: (t: TaskPopulated) => void;
};
