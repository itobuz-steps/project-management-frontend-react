import { useState } from 'react';
import { message } from 'antd';
import { commentsApi } from '../services/commentService';

export function useCommentComposer(taskId: string) {
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const reset = () => {
    setContent('');
    setAttachments([]);
  };

  const submit = async () => {
    if (!content.trim()) {
      messageApi.warning('Comment cannot be empty');
      return null;
    }

    const formData = new FormData();
    formData.append('message', content);

    if (attachments[0]) {
      formData.append('attachment', attachments[0]);
    }

    setSubmitting(true);
    try {
      const comment = await commentsApi.createComment(taskId, formData);
      messageApi.success('Comment added');
      reset();
      return comment;
    } catch {
      message.error('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    content,
    attachments,
    submitting,
    contextHolder,
    setContent,
    setAttachments,
    submit,
    reset,
  };
}
