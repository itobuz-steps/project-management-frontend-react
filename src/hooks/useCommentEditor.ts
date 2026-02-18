// hooks/useCommentEditor.ts
import { useState } from 'react';
import { message } from 'antd';
import { commentsApi } from '../services/commentService';
import type { Comment } from '../services/types/comments.types';

export function useCommentEditor(
  comment: Comment,
  onUpdate: (comment: Comment) => void,
  onDelete: (id: string) => void
) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(comment.message);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [messageApi, contextHolder] = message.useMessage();

  const reset = () => {
    setIsEditing(false);
    setContent(comment.message);
    setAttachments([]);
  };

  const save = async () => {
    if (!content.trim()) {
      messageApi.warning('Comment cannot be empty');
      return;
    }

    const updated = await commentsApi.updateComment(
      comment.taskId as string,
      comment._id,
      { message: content }
    );

    onUpdate({ ...comment, ...updated });
    reset();
  };

  const remove = async () => {
    await commentsApi.deleteComment(comment.taskId as string, comment._id);

    messageApi.success('Comment deleted');
    onDelete(comment._id);
  };

  return {
    isEditing,
    content,
    attachments,
    contextHolder,
    setIsEditing,
    setContent,
    setAttachments,
    save,
    remove,
    reset,
  };
}
