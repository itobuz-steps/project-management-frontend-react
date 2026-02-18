import { Empty, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { CommentItem } from './CommentItem';
import type { CommentsTabProps } from './comment.type';
import { TextEditor } from '../textEditor/TextEditor';
import { COMMENT_TEMPLATES } from '../taskModal/constants';
import { useTaskComments } from '../../hooks/useTaskComments';
import { useCommentComposer } from '../../hooks/useCommentComposer';

export function CommentsTab({ taskId }: CommentsTabProps) {
  const [isComposerOpen, setIsComposerOpen] = useState(false);

  const { comments, loading, addComment, updateComment, removeComment } =
    useTaskComments(taskId);

  const composer = useCommentComposer(taskId);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'm' && !isComposerOpen) {
        setIsComposerOpen(true);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isComposerOpen]);

  const handleSubmit = async () => {
    const comment = await composer.submit();
    if (comment) {
      addComment(comment);
      setIsComposerOpen(false);
    }
  };

  return (
    <>
      {composer.contextHolder}

      {/* Composer */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex gap-3">
          <img src="/profile.png" className="h-8 w-8 rounded-full" />

          <div className="flex-1">
            {!isComposerOpen ? (
              <>
                <div
                  onClick={() => setIsComposerOpen(true)}
                  className="cursor-text rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-500 hover:border-gray-400"
                >
                  Add a comment…
                </div>

                <div className="mt-2 flex flex-wrap gap-2">
                  {COMMENT_TEMPLATES.map((template) => (
                    <button
                      key={template}
                      onClick={() => {
                        composer.setContent(template + ' ');
                        setIsComposerOpen(true);
                      }}
                      className="rounded border px-2 py-1 text-xs hover:bg-gray-50"
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
                comment
                content={composer.content}
                onChange={composer.setContent}
                onAttachmentsChange={composer.setAttachments}
                onSave={handleSubmit}
                onCancel={() => {
                  composer.reset();
                  setIsComposerOpen(false);
                }}
                disabled={composer.submitting}
              />
            )}
          </div>
        </div>
      </div>

      {/* Comments */}
      {loading && <Spin />}

      {!loading && !comments.length && <Empty description="No comments yet" />}

      {!loading &&
        comments.map((comment) => (
          <CommentItem
            key={comment._id}
            comment={comment}
            onDelete={removeComment}
            onUpdate={updateComment}
          />
        ))}
    </>
  );
}
