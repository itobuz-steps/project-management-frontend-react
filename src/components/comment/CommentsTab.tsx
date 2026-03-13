import { useEffect, useRef, useState } from 'react';
import { CommentItem } from './CommentItem';
import type { CommentsTabProps } from './comment.type';
import { TextEditor } from '../textEditor/TextEditor';
import { COMMENT_TEMPLATES } from '../taskModal/constants';
import { useTaskComments } from '../../hooks/useTaskComments';
import { useCommentComposer } from '../../hooks/useCommentComposer';
import { DataLoader } from '../ui/DataLoader';
import { useProjectMetaData } from '../../hooks/useProjectMetaData';
import { Button } from 'antd';
import { useProjectTasks } from '../../hooks/useProjectTasks';

export function CommentsTab({ task }: CommentsTabProps) {
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const composerRef = useRef<HTMLDivElement | null>(null);
  const { tasks: projectTasks } = useProjectTasks(task.projectId as string);

  const { comments, loading, addComment, updateComment, removeComment } =
    useTaskComments(task._id);

  const composer = useCommentComposer(task._id);

  const { members } = useProjectMetaData(task.projectId as string);

  const mentionItems = members.map((member) => ({
    id: member._id,
    label: member.name,
    avatar: member.profileImage,
  }));

  const { reset } = composer;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      const clickedInsideComposer = composerRef.current?.contains(target);

      const clickedMentionDropdown = target.closest('.mention-dropdown');

      const clickedAntdDropdown =
        target.closest('.ant-select-dropdown') ||
        target.closest('.ant-dropdown') ||
        target.closest('.ant-picker-dropdown');

      if (
        isComposerOpen &&
        !clickedInsideComposer &&
        !clickedMentionDropdown &&
        !clickedAntdDropdown
      ) {
        reset();
        setIsComposerOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isComposerOpen, reset]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'M' && !isComposerOpen) {
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
      <div className="border-b border-gray-200 py-4" ref={composerRef}>
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
                  <strong>Pro tip:</strong> press <kbd>'M'</kbd> to comment
                </div>
              </>
            ) : (
              <div>
                <TextEditor
                  comment
                  content={composer.content}
                  onChange={composer.setContent}
                  onEditorJsonChange={composer.setEditorJson}
                  onAttachmentsChange={composer.setAttachments}
                  onSave={handleSubmit}
                  onCancel={() => {
                    composer.reset();
                    setIsComposerOpen(false);
                  }}
                  disabled={composer.submitting}
                  mentionItems={mentionItems}
                  taskItems={projectTasks.map((task) => ({
                    id: task._id,
                    label: task.title,
                    type: task.type,
                  }))}
                />

                <div className="mt-2 flex justify-end gap-2">
                  <Button
                    style={{
                      border: 'var(--color-primary-500) solid 1px',
                    }}
                    type="text"
                    onClick={() => {
                      composer.reset();
                      setIsComposerOpen(false);
                    }}
                    disabled={composer.submitting}
                  >
                    Cancel
                  </Button>

                  <Button
                    style={{
                      backgroundColor: 'var(--color-primary-500)',
                      color: 'white',
                    }}
                    type="primary"
                    loading={composer.submitting}
                    disabled={!composer.content.trim()}
                    onClick={handleSubmit}
                  >
                    Comment
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Comments */}
      <DataLoader
        loading={loading}
        isEmpty={!comments.length}
        emptyText="No comments yet"
      >
        <div className="space-y-1">
          {comments.map((comment) => (
            <CommentItem
              key={comment._id}
              task={task}
              comment={comment}
              onDelete={removeComment}
              onUpdate={updateComment}
            />
          ))}
        </div>
      </DataLoader>
    </>
  );
}
