import type { TaskPopulated } from '../../services/types/tasks.types';

export interface AttachmentsTabProps {
  task: TaskPopulated;
  onUpdated?: (task: TaskPopulated) => void;
}
