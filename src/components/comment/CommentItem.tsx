import { useRef, useEffect } from 'react';
import { Avatar, Button, Popconfirm, Space, Typography } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PaperClipOutlined,
} from '@ant-design/icons';
import type { CommentItemProps, MentionSpanProps } from './comment.type';
import { formatDistanceToNow } from 'date-fns';
import { TextEditor } from '../textEditor/TextEditor';
import { Link } from 'react-router-dom';
import { useCommentEditor } from '../../hooks/useCommentEditor';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { useProjectMetaData } from '../../hooks/useProjectMetaData';
import type { Components } from 'react-markdown';

const { Text } = Typography;

export function CommentItem({
  task,
  comment,
  onDelete,
  onUpdate,
}: CommentItemProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const editor = useCommentEditor({ comment, onUpdate, onDelete });

  const { members } = useProjectMetaData(task.projectId as string);

  const mentionItems = members.map((member) => ({
    id: member._id,
    label: member.name,
    avatar: member.profileImage,
  }));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!editor.isEditing) return;

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
        editor.reset();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [editor.isEditing]);

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

      return <span {...spanProps} />;
    },
  };

  return (
    <>
      {editor.contextHolder}

      <div
        className="group flex gap-2 rounded-md px-2 py-2 hover:bg-gray-50"
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
            {/* Header */}
            <Space className="w-full justify-between">
              <div>
                <Text className="text-sm font-medium text-gray-900">
                  {comment.author.name || 'You'}
                </Text>
                <span className="ml-2 text-xs text-gray-400">
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
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => {
                      editor.setIsEditing(true);
                    }}
                  />
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

            {/* Body */}
            {!editor.isEditing ? (
              <div className="prose" onClick={() => editor.setIsEditing(true)}>
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
                />

                {/* Action Buttons */}
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
    </>
  );
}
