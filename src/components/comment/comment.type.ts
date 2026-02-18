import type { Comment } from '../../services/types/comments.types';

export interface CommentsTabProps {
  taskId: string;
}

export interface CommentItemProps {
  comment: Comment;
  onDelete: (id: string) => void;
  onUpdate: (comment: Comment) => void;
}
