import { useRef, useEffect, useState } from 'react';
import { Avatar, Button, Popconfirm, Space, Typography } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PaperClipOutlined,  
  CommentOutlined,
} from '@ant-design/icons';
import type { CommentItemProps, MentionSpanProps } from './comment.type';
import { formatDistanceToNow } from 'date-fns';
import { TextEditor } from '../textEditor/TextEditor';
import { Link } from 'react-router-dom';
import { useCommentEditor } from '../../hooks/useCommentEditor';
import { useReplyComposer } from '../../hooks/useReplyComposer';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { useProjectMetaData } from '../../hooks/useProjectMetaData';
import type { Components } from 'react-markdown';
import { useProjectTasks } from '../../hooks/useProjectTasks';
import { ReplyItem } from './ReplyItem';

const { Text } = Typography;

export function CommentItem({ task, comment }: CommentItemProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const editor = useCommentEditor({ comment });
  const replyComposer = useReplyComposer(task._id, comment._id);
  const [isReplyMode, setIsReplyMode] = useState(false);

  const { members } = useProjectMetaData(task.projectId as string);
  const { tasks: projectTasks } = useProjectTasks(task.projectId as string);

  const mentionItems = members.map((member) => ({
    id: member._id,
    label: member.name,
    avatar: member.profileImage,
  }));

  const { isEditing, reset } = editor;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isEditing) {
        return;
      }

      const target = event.target as HTMLElement;

      const clickedInsideEditor =
        editorRef.current && editorRef.current.contains(target);

      const clickedAntdDropdown =
        target.closest('.ant-select-dropdown') ||
        target.closest('.ant-dropdown') ||
        target.closest('.ant-picker-dropdown');

      const clickedMentionDropdown = target.closest('.mention-dropdown');

      if (
        !clickedInsideEditor &&
        !clickedAntdDropdown &&
        !clickedMentionDropdown
      ) {
        reset();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isEditing, reset]);

  const markdownComponents: Components = {
    span: (props) => {
      const spanProps = props as MentionSpanProps;

      if (spanProps['data-type'] === 'mention') {
        return (
          <span
            className="cursor-pointer font-medium text-blue-600"
            {...spanProps}
          />
        );
      }

      if (spanProps['data-task-id']) {
        const taskId = spanProps['data-task-id'];
        return (
          <Link
            to={`?taskId=${taskId}`}
            className="cursor-pointer font-medium text-purple-600 hover:underline"
          >
            {spanProps.children}
          </Link>
        );
      }

      return <span {...spanProps} />;
    },
  };

  return (
    <div>
      {/* Main Comment */}
      <div
        className="group flex gap-2 rounded-md px-2 py-2 hover:bg-gray-50 dark:hover:bg-neutral-800"
        ref={editorRef}
      >
        <Avatar
          src={
            comment.author.profileImage
              ? `${comment.author.profileImage}`
              : '/profile.png'
          }
        >
          {comment.author.name?.[0]}
        </Avatar>

        <div className="flex-1">
          <Space orientation="vertical" size={0} className="w-full">
            {/* Header with Author and Actions */}
            <Space className="w-full justify-between">
              <div>
                <Text className="text-sm font-medium text-gray-900 dark:text-neutral-100">
                  {comment.author.name || 'You'}
                </Text>
                <span className="ml-2 text-xs text-gray-400 dark:text-neutral-400">
                  {formatDistanceToNow(new Date(comment.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>

              <Space className="opacity-0 transition group-hover:opacity-100">
                {comment.attachment && (
                  <Link to={comment.attachment} target="_blank">
                    <Button type="text" icon={<PaperClipOutlined />} />
                  </Link>
                )}

                {!editor.isEditing && (
                  <>
                    <Button
                      type="text"
                      icon={<CommentOutlined />}
                      onClick={() => setIsReplyMode(!isReplyMode)}
                    />
                    <Button
                      type="text"
                      icon={<EditOutlined />}
                      onClick={() => {
                        editor.setIsEditing(true);
                      }}
                    />
                  </>
                )}

                <Popconfirm
                  title="Delete comment?"
                  description="This action cannot be undone."
                  onConfirm={editor.remove}
                  okText="Delete"
                  cancelText="Cancel"
                  icon={null}
                  okButtonProps={{
                    style: {
                      backgroundColor: 'var(--color-primary-500)',
                      color: 'white',
                    },
                  }}
                  cancelButtonProps={{
                    style: {
                      border: 'var(--color-primary-500) solid 1px',
                    },
                    type: 'text',
                  }}
                >
                  <Button danger type="text" icon={<DeleteOutlined />} />
                </Popconfirm>
              </Space>
            </Space>

            {/* Comment Body - View or Edit Mode */}
            {!editor.isEditing ? (
              <div className="prose prose-sm dark:prose-invert max-w-none dark:text-neutral-100">
                <ReactMarkdown
                  rehypePlugins={[rehypeRaw]}
                  components={markdownComponents}
                >
                  {comment.message}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="mt-2">
                <TextEditor
                  comment
                  content={editor.content}
                  onChange={editor.setContent}
                  onAttachmentsChange={editor.setAttachments}
                  onSave={editor.save}
                  onCancel={editor.reset}
                  mentionItems={mentionItems}
                  onEditorJsonChange={editor.setEditorJson}
                  taskItems={projectTasks.map((task) => ({
                    id: task._id,
                    label: task.title,
                    type: task.type,
                    key: task.key,
                  }))}
                />

                {/* Edit Action Buttons */}
                <div className="mt-2 flex justify-end gap-2">
                  <Button
                    style={{
                      border: 'var(--color-primary-500) solid 1px',
                    }}
                    type="text"
                    onClick={editor.reset}
                  >
                    Cancel
                  </Button>

                  <Button
                    style={{
                      backgroundColor: 'var(--color-primary-500)',
                      color: 'white',
                    }}
                    type="primary"
                    onClick={editor.save}
                  >
                    Save
                  </Button>
                </div>
              </div>
            )}
          </Space>
        </div>
      </div>

      {/* Reply Composer */}
      {isReplyMode && (
        <div className="mt-3 ml-10 border-l-2 border-gray-200 pl-4 dark:border-neutral-700">
          <div className="flex gap-2">
            <img 
              src="/profile.png" 
              className="h-8 w-8 rounded-full flex-shrink-0" 
              alt="User avatar"
            />
            <div className="flex-1">
              <TextEditor
                comment
                content={replyComposer.content}
                onChange={replyComposer.setContent}
                onAttachmentsChange={replyComposer.setAttachments}
                onSave={async () => {
                  await replyComposer.submit();
                  setIsReplyMode(false);
                }}
                onCancel={() => {
                  replyComposer.reset();
                  setIsReplyMode(false);
                }}
                mentionItems={mentionItems}
                onEditorJsonChange={replyComposer.setEditorJson}
                taskItems={projectTasks.map((task) => ({
                  id: task._id,
                  label: task.title,
                  type: task.type,
                  key: task.key,
                }))}
              />

              {/* Reply Action Buttons */}
              <div className="mt-2 flex justify-end gap-2">
                <Button
                  style={{
                    border: 'var(--color-primary-500) solid 1px',
                  }}
                  type="text"
                  onClick={() => {
                    replyComposer.reset();
                    setIsReplyMode(false);
                  }}
                  size="small"
                  disabled={replyComposer.submitting}
                >
                  Cancel
                </Button>

                <Button
                  style={{
                    backgroundColor: 'var(--color-primary-500)',
                    color: 'white',
                  }}
                  type="primary"
                  onClick={async () => {
                    await replyComposer.submit();
                    setIsReplyMode(false);
                  }}
                  size="small"
                  loading={replyComposer.submitting}
                  disabled={!replyComposer.content.trim()}
                >
                  Reply
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Replies List */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 ml-10 border-l-2 border-gray-200 dark:border-neutral-700">
          {comment.replies.map((reply) => (
            <ReplyItem key={reply._id} task={task} comment={reply} />
          ))}
        </div>
      )}
    </div>
  );
}