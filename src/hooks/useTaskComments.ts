import { useEffect, useState } from 'react';
import { commentsApi } from '../services/commentService';
import type { Comment } from '../services/types/comments.types';
import { message } from 'antd';

export function useTaskComments(taskId?: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!taskId) {
      return;
    }

    async function fetchComments() {
      setLoading(true);
      try {
        const { result } = await commentsApi.getAllComments(taskId as string);
        setComments(result);
      } catch {
        message.error('Failed to get comments');
      } finally {
        setLoading(false);
      }
    }

    fetchComments();
  }, [taskId]);

  const addComment = (comment: Comment) => {
    setComments((prev) => [...prev, comment]);
  };

  const updateComment = (updated: Comment) => {
    setComments((prev) =>
      prev.map((comment) => (comment._id === updated._id ? updated : comment))
    );
  };

  const removeComment = (id: string) => {
    setComments((prev) => prev.filter((comment) => comment._id !== id));
  };

  return {
    comments,
    loading,
    addComment,
    updateComment,
    removeComment,
  };
}
