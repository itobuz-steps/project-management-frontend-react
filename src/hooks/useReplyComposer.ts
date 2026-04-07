import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { commentsApi } from '../services/commentService';
import { AxiosError } from 'axios';
import { extractMentions } from '../utils/extractMentions';
import type { JSONContent } from '@tiptap/react';

export function useReplyComposer(taskId: string, parentId: string) {
  const queryClient = useQueryClient();

  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [editorJson, setEditorJson] = useState<JSONContent | null>(null);

  const reset = () => {
    setContent('');
    setAttachments([]);
    setEditorJson(null);
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append('message', content);
      formData.append('parentId', parentId);

      if (attachments[0]) {
        formData.append('attachment', attachments[0]);
      }

      const mentions = extractMentions(editorJson);
      mentions.forEach((id) => formData.append('mentions[]', id));

      return commentsApi.createComment(taskId, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', taskId] });
      message.success('Reply added');
      reset();
    },
    onError: (error) => {
      const axiosError = error as AxiosError<{ message?: string }>;

      message.error(
        axiosError.response?.data?.message ||
          axiosError.message ||
          'Failed to add reply'
      );
    },
  });

  const submit = async () => {
    if (!content.trim()) {
      message.warning('Reply cannot be empty');
      return null;
    }

    return mutation.mutateAsync();
  };

  return {
    content,
    editorJson,
    attachments,
    submitting: mutation.isPending,
    setContent,
    setEditorJson,
    setAttachments,
    submit,
    reset,
  };
}
