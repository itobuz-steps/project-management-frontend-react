import type { Comment } from '../../services/types/comments.types';
import type { TaskPopulated } from '../../services/types/tasks.types';

export interface CommentsTabProps {
  task: TaskPopulated;
}

export interface CommentItemProps {
  task: TaskPopulated;
  comment: Comment;
  onDelete: (id: string) => void;
  onUpdate: (comment: Comment) => void;
}

export type MentionSpanProps = React.HTMLAttributes<HTMLSpanElement> & {
  'data-type'?: string;
  'data-id'?: string;
  'data-task-id'?: string;
};
