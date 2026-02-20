import { useState } from 'react';
import { message } from 'antd';
import { commentsApi } from '../services/commentService';
import type { JSONContent } from '@tiptap/react';

export function useCommentComposer(taskId: string) {
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [editorJson, setEditorJson] = useState<JSONContent | null>(null);
  const [messageApi, contextHolder] = message.useMessage();

  const reset = () => {
    setContent('');
    setAttachments([]);
  };

  const extractMentions = () => {
    if (!editorJson) {
      return [];
    }

    const ids = new Set<string>();

    const walk = (node: JSONContent) => {
      if (node.type === 'mention' && node.attrs?.id) {
        ids.add(node.attrs.id);
      }
      node.content?.forEach(walk);
    };

    walk(editorJson);
    return Array.from(ids);
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

    const mentions = extractMentions();
    mentions.forEach((id) => formData.append('mentions[]', id));

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
    editorJson,
    attachments,
    submitting,
    contextHolder,
    setContent,
    setEditorJson,
    setAttachments,
    submit,
    reset,
  };
}
