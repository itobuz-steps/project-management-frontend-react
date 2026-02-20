import { useEffect, useState } from 'react';
import { message } from 'antd';
import { commentsApi } from '../services/commentService';
import type { Comment } from '../services/types/comments.types';
import type { JSONContent } from '@tiptap/react';

export function useCommentEditor(
  comment: Comment,
  onUpdate: (comment: Comment) => void,
  onDelete: (id: string) => void
) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState<string>(comment.message);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [editorJson, setEditorJson] = useState<JSONContent | null>(null);

  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    setContent(comment.message);
  }, [comment]);

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

    const mentions = extractMentions();

    const updated = await commentsApi.updateComment(
      comment.taskId as string,
      comment._id,
      {
        message: content,
        mentions,
      }
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
    editorJson,
    setEditorJson,
    setIsEditing,
    setContent,
    setAttachments,
    save,
    remove,
    reset,
  };
}
