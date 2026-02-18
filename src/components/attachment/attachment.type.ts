import type {
  TaskAttachment,
  TaskPopulated,
} from '../../services/types/tasks.types';

export interface AttachmentsTabProps {
  task: TaskPopulated;
  onUpdated?: (task: TaskPopulated) => void;
}

export interface AttachmentsItemProps {
  attachment: TaskAttachment;
  onRemove: () => void;
}
