import type { Comment } from "../../services/types/comments.types";
import type { TaskPopulated } from "../../services/types/tasks.types";

export interface TaskModalProps {
  taskId: string;
  onClose: () => void;
}

export interface CommentsTabProps {
  taskId: string;
}

export interface AttachmentsTabProps {
  task: TaskPopulated;
}

export interface CommentItemProps {
  comment: Comment;
  onDelete: (id: string) => void;
  onUpdate: (comment: Comment) => void;
}