import { Avatar, Button, Popconfirm, Space, Typography } from 'antd';
import { message } from 'antd';
import { DeleteOutlined, PaperClipOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { commentsApi } from '../../services/commentService';
import { config } from '../../config/config';
import type { CommentItemProps } from './taskDrawer.type';
import { formatDistanceToNow } from 'date-fns';
import { TextEditor } from '../textEditor/TextEditor';
import { Link } from 'react-router-dom';

const { Text } = Typography;

export function CommentItem({ comment, onDelete, onUpdate }: CommentItemProps) {
  const [messageApi, contextHolder] = message.useMessage();
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(comment.message);
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleSave = async () => {
    if (!content.trim()) {
      messageApi.warning('Comment cannot be empty');
      return;
    }

    const formData = new FormData();
    formData.append('message', content);

    if (attachments[0]) {
      formData.append('attachment', attachments[0]);
    }

    const updated = await commentsApi.updateComment(
      comment.taskId as string,
      comment._id,
      {
        message: content,
      }
    );

    onUpdate({ ...comment, ...updated });
    setIsEditing(false);
    setAttachments([]);
  };

  const handleDelete = async () => {
    await commentsApi.deleteComment(comment.taskId as string, comment._id);
    messageApi.success('Comment deleted');
    onDelete(comment._id);
  };

  return (
    <>
      {contextHolder}
      <div className="group flex gap-2 rounded-md px-2 py-2 hover:bg-gray-50">
        <div className="flex items-center justify-center">
          <Avatar
            src={
              comment.author.profileImage
                ? `${config.api_base_url}/uploads/${comment.author.profileImage}`
                : '/profile.png'
            }
          >
            {comment.author.name?.[0]}
          </Avatar>
        </div>

        <div className="flex-1">
          <Space orientation="vertical" size={0} className="w-full">
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
                    <Button icon={<PaperClipOutlined />} type="text" />
                  </Link>
                )}

                <Popconfirm
                  title="Are you sure you want to delete this comment?"
                  onConfirm={handleDelete}
                >
                  <Button danger type="text" icon={<DeleteOutlined />} />
                </Popconfirm>
              </Space>
            </Space>

            {!isEditing ? (
              <div
                className="prose prose-sm max-w-none cursor-text rounded px-1 py-0.5 hover:bg-gray-100"
                onClick={() => setIsEditing(true)}
                dangerouslySetInnerHTML={{ __html: comment.message }}
              />
            ) : (
              <TextEditor
                comment
                content={content}
                onChange={setContent}
                onAttachmentsChange={setAttachments}
                onSave={handleSave}
                onCancel={() => {
                  setIsEditing(false);
                  setContent(comment.message);
                  setAttachments([]);
                }}
              />
            )}
          </Space>
        </div>
      </div>
    </>
  );
}
