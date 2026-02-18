import { Avatar, Button, Popconfirm, Space, Typography } from 'antd';
import { DeleteOutlined, PaperClipOutlined } from '@ant-design/icons';
import { config } from '../../config/config';
import type { CommentItemProps } from './comment.type';
import { formatDistanceToNow } from 'date-fns';
import { TextEditor } from '../textEditor/TextEditor';
import { Link } from 'react-router-dom';
import { useCommentEditor } from '../../hooks/useCommentEditor';

const { Text } = Typography;

export function CommentItem({ comment, onDelete, onUpdate }: CommentItemProps) {
  const editor = useCommentEditor(comment, onUpdate, onDelete);

  return (
    <>
      {editor.contextHolder}

      <div className="group flex gap-2 rounded-md px-2 py-2 hover:bg-gray-50">
        <Avatar
          src={
            comment.author.profileImage
              ? `${config.api_base_url}/uploads/${comment.author.profileImage}`
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
                  <Link
                    to={`${config.api_base_url}/uploads/${comment.attachment}`}
                    target="_blank"
                  >
                    <Button type="text" icon={<PaperClipOutlined />} />
                  </Link>
                )}

                <Popconfirm
                  title="Are you sure you want to delete this comment?"
                  onConfirm={editor.remove}
                >
                  <Button danger type="text" icon={<DeleteOutlined />} />
                </Popconfirm>
              </Space>
            </Space>

            {/* Body */}
            {!editor.isEditing ? (
              <div
                className="prose prose-sm max-w-none cursor-text rounded px-1 py-0.5 hover:bg-gray-100"
                onClick={() => editor.setIsEditing(true)}
                dangerouslySetInnerHTML={{
                  __html: comment.message,
                }}
              />
            ) : (
              <TextEditor
                comment
                content={editor.content}
                onChange={editor.setContent}
                onAttachmentsChange={editor.setAttachments}
                onSave={editor.save}
                onCancel={editor.reset}
              />
            )}
          </Space>
        </div>
      </div>
    </>
  );
}
