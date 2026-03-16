import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { commentsApi } from '../services/commentService';
import type { Comment } from '../services/types/comments.types';
import { message } from 'antd';
import { AxiosError } from 'axios';

export function useTaskComments(taskId?: string) {
  const commentsQuery = useQuery({
    queryKey: ['comments', taskId],
    queryFn: async () => {
      const { result } = await commentsApi.getAllComments(taskId as string);
      return result;
    },
    enabled: !!taskId,
  });

  const comments: Comment[] = commentsQuery.data ?? [];
  const loading = commentsQuery.isLoading;

  useEffect(() => {
    if (commentsQuery.error) {
      const error = commentsQuery.error as AxiosError<{ message?: string }>;

      message.error(
        error.response?.data?.message ||
          error.message ||
          'Failed to get comments'
      );
    }
  }, [commentsQuery.error]);

  return {
    comments,
    loading,
  };
}
