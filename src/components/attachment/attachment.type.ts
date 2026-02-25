import type {
  TaskAttachment,
  TaskPopulated,
} from '../../services/types/tasks.types';

export interface AttachmentsTabProps {
  isDrawer?: boolean;
  task: TaskPopulated;
  onUpdated: (task: TaskPopulated) => void;
}

export interface AttachmentsItemProps {
  isDrawer?: boolean;
  attachment: TaskAttachment;
  onRemove: () => void;
}
