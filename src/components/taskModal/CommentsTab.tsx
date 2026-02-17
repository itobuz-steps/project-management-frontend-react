import { Empty, Spin, message } from 'antd';
import { useEffect, useState } from 'react';
import { commentsApi } from '../../services/commentService';
import type { Comment } from '../../services/types/comments.types';
import { CommentItem } from './CommentItem';
import type { CommentsTabProps } from './taskDrawer.type';
import { TextEditor } from '../textEditor/TextEditor';
import { COMMENT_TEMPLATES } from './constants';

export function CommentsTab({ taskId }: CommentsTabProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleSubmit = async () => {
    if (!content.trim()) {
      messageApi.warning('Comment cannot be empty');
      return;
    }

    const formData = new FormData();
    formData.append('message', content);

    if (attachments[0]) {
      formData.append('attachment', attachments[0]);
    }

    setSubmitting(true);
    try {
      const newComment = await commentsApi.createComment(taskId, formData);
      setComments((prev) => [...prev, newComment]);
      setContent('');
      setAttachments([]);
      messageApi.success('Comment added');
    } finally {
      setSubmitting(false);
    }
  };

  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (!taskId) {
      return;
    }

    const fetchComments = async () => {
      setLoading(true);
      try {
        const { result } = await commentsApi.getAllComments(taskId);
        setComments(result);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [taskId]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'm' && !isComposerOpen) {
        // e.preventDefault();
        setIsComposerOpen(true);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isComposerOpen]);

  return (
    <>
      {contextHolder}

      {/* Comment input */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex gap-3">
          {/* Avatar */}
          <img src="/profile.png" alt="me" className="h-8 w-8 rounded-full" />

          {/* Composer */}
          <div className="flex-1">
            {!isComposerOpen ? (
              <>
                {/* Collapsed input */}
                <div
                  onClick={() => setIsComposerOpen(true)}
                  className="cursor-text rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-500 hover:border-gray-400"
                >
                  Add a comment…
                </div>

                {/* Templates */}
                <div className="mt-2 flex flex-wrap gap-2">
                  {COMMENT_TEMPLATES.map((template) => (
                    <button
                      key={template}
                      onClick={() => {
                        setContent(template + ' ');
                        setIsComposerOpen(true);
                      }}
                      className="rounded border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 hover:bg-gray-50"
                    >
                      {template}
                    </button>
                  ))}
                </div>

                <div className="mt-2 text-xs text-gray-400">
                  <strong>Pro tip:</strong> press <kbd>M</kbd> to comment
                </div>
              </>
            ) : (
              <TextEditor
                key={content === '' ? 'empty' : 'filled'}
                comment
                content={content}
                onChange={setContent}
                onAttachmentsChange={setAttachments}
                onSave={handleSubmit}
                onCancel={() => {
                  setIsComposerOpen(false);
                  setContent('');
                  setAttachments([]);
                }}
                disabled={submitting}
              />
            )}
          </div>
        </div>
      </div>

      {/* Comments */}
      {loading && <Spin />}

      {!loading && !comments.length && <Empty description="No comments yet" />}

      {!loading && comments.length > 0 && (
        <div>
          {comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              onDelete={(id) =>
                setComments((prev) =>
                  prev.filter((comment) => comment._id !== id)
                )
              }
              onUpdate={(updated) =>
                setComments((prev) =>
                  prev.map((comment) =>
                    comment._id === updated._id ? updated : comment
                  )
                )
              }
            />
          ))}
        </div>
      )}
    </>
  );
}
