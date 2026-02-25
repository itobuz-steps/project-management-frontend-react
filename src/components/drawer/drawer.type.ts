import type { Comment } from '../../services/types/comments.types';
import type { TaskPopulated } from '../../services/types/tasks.types';

export interface TaskDrawerProps {
  taskId: string;
  onClose: () => void;
}

export interface DrawerViewProps {
  task: TaskPopulated;
  isMobile: boolean;
  onUpdated: (t: TaskPopulated) => void;
  loading?: boolean;
}

export interface DrawerHeaderProps {
  task: TaskPopulated;
  onUpdated: (t: TaskPopulated) => void;
}

export interface DrawerDescriptionProps {
  task: TaskPopulated;
  onPatch?: (id: string, patch: Partial<TaskPopulated>) => void;
}

export interface DrawerSidebarProps {
  task: TaskPopulated;
  onUpdated: (t: TaskPopulated) => void;
}

export interface DrawerCommentsTabProps {
  taskId: string;
}

export interface DrawerAttachmentsTabProps {
  task: TaskPopulated;
}

export interface DrawerCommentItemProps {
  comment: Comment;
  onDelete: (id: string) => void;
  onUpdate: (comment: Comment) => void;
}

export interface DrawerSubtasksTabProps {
  task: TaskPopulated;
}

export interface DrawerSidebarRowProps {
  label: string;
  children: React.ReactNode;
}

export type Tabs = 'comments' | 'attachments' | 'activity';
