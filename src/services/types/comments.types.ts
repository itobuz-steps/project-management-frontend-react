export interface CommentAuthor {
  _id: string;
  name: string;
  profileImage?: string;
}

export interface Comment {
  _id: string;
  taskId: string;
  message: string;
  author: CommentAuthor;
  attachment?: string | null;
  replies: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface UpdateCommentPayload {
  message?: string;
  attachment?: string | null;
  mentions?: string[];
}
