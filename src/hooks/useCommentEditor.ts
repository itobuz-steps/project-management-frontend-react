import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { commentsApi } from '../services/commentService';
import type { JSONContent } from '@tiptap/react';
import type { UseCommentEditorParams } from './hooks.types';
import type { Comment } from '../services/types/comments.types';
import { AxiosError } from 'axios';
import { extractMentions } from '../utils/extractMentions';

export function useCommentEditor({ comment }: UseCommentEditorParams) {
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState<string>(comment.message);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [editorJson, setEditorJson] = useState<JSONContent | null>(null);

  useEffect(() => {
    setContent(comment.message);
  }, [comment]);

  const reset = () => {
    setIsEditing(false);
    setContent(comment.message);
    setAttachments([]);
    setEditorJson(null);
  };

  const updateMutation = useMutation({
    mutationFn: async () => {
      const mentions = extractMentions(editorJson);

      return commentsApi.updateComment(comment.taskId as string, comment._id, {
        message: content,
        mentions,
      });
    },
    onSuccess: (updated) => {
      queryClient.setQueryData<Comment[]>(
        ['comments', comment.taskId],
        (prev = []) =>
          prev.map((item) =>
            item._id === comment._id ? { ...item, ...updated } : item
          )
      );

      message.success('Comment updated');
      reset();
    },
    onError: (error) => {
      const axiosError = error as AxiosError<{ message?: string }>;

      message.error(
        axiosError.response?.data?.message ||
          axiosError.message ||
          'Failed to update comment'
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () =>
      commentsApi.deleteComment(comment.taskId as string, comment._id),
    onSuccess: () => {
      queryClient.setQueryData<Comment[]>(
        ['comments', comment.taskId],
        (prev = []) => prev.filter((item) => item._id !== comment._id)
      );

      message.success('Comment deleted');
    },
    onError: (error) => {
      const axiosError = error as AxiosError<{ message?: string }>;

      message.error(
        axiosError.response?.data?.message ||
          axiosError.message ||
          'Failed to delete comment'
      );
    },
  });

  const save = async () => {
    if (!content.trim()) {
      message.warning('Comment cannot be empty');
      return;
    }

    await updateMutation.mutateAsync();
  };

  const remove = async () => {
    await deleteMutation.mutateAsync();
  };

  return {
    isEditing,
    content,
    attachments,
    editorJson,
    setEditorJson,
    setIsEditing,
    setContent,
    setAttachments,
    save,
    remove,
    reset,
    saving: updateMutation.isPending,
    deleting: deleteMutation.isPending,
  };
}
