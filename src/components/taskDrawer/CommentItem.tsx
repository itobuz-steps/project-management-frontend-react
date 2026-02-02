import { Avatar, Button, Popconfirm, Space, Typography, Input } from 'antd';
import { message } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PaperClipOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import { marked } from 'marked';
import { commentsApi } from '../../services/commentService';
import { config } from '../../config/config';
import type { CommentItemProps } from './taskDrawer.type';
import { formatDistanceToNow } from 'date-fns';

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

export function CommentItem({ comment, onDelete, onUpdate }: CommentItemProps) {
  const [messageApi, contextHolder] = message.useMessage();

  const [isEditing, setIsEditing] = useState(false);
  const [messageText, setMessageText] = useState(comment.message);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!messageText.trim()) {
      messageApi.warning('Comment cannot be empty');
      return;
    }

    setSaving(true);
    try {
      const updated = await commentsApi.updateComment(comment._id, {
        message: messageText,
      });

      messageApi.success('Comment updated successfully');
      onUpdate(updated);
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    await commentsApi.deleteComment(comment._id);
    messageApi.success('Comment deleted');
    onDelete(comment._id);
  };

  return (
    <>
      {contextHolder}
      <div className="flex gap-3 border-b border-gray-200 px-2 py-2">
        <Avatar
          src={
            comment.author.profileImage
              ? `${config.api_base_url}/uploads/profile/${comment.author.profileImage}`
              : '/assets/img/profile.png'
          }
        />

        <div className="flex-1">
          <Space orientation="vertical" size={2} className="w-full">
            <Space className="w-full justify-between">
              <div>
                <Text strong>{comment.author.name}</Text>
                <div className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(comment.createdAt), {
                    addSuffix: true,
                  })}
                </div>
              </div>

              <Space>
                {comment.attachment && (
                  <Button
                    icon={<PaperClipOutlined />}
                    type="text"
                    onClick={() =>
                      window.open(
                        `${config.api_base_url}/uploads/commentsAttachment/${comment.attachment}`,
                        '_blank'
                      )
                    }
                  />
                )}

                <Button
                  icon={<EditOutlined />}
                  type="text"
                  onClick={() => setIsEditing(true)}
                />

                <Popconfirm
                  title="Are you sure you want to delete this comment?"
                  onConfirm={handleDelete}
                >
                  <Button danger type="text" icon={<DeleteOutlined />} />
                </Popconfirm>
              </Space>
            </Space>

            {!isEditing ? (
              <Paragraph>
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{
                    __html: marked.parse(comment.message),
                  }}
                />
              </Paragraph>
            ) : (
              <>
                <TextArea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  rows={3}
                />
                <Button
                  type="primary"
                  loading={saving}
                  onClick={handleSave}
                  style={{ backgroundColor: 'var(--color-primary-500)' }}
                >
                  Save
                </Button>
              </>
            )}
          </Space>
        </div>
      </div>
    </>
  );
}
