import { Avatar, Button, Popconfirm, Space, Typography, Input } from 'antd';
import { message } from 'antd';
import { DeleteOutlined, PaperClipOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { marked } from 'marked';
import { commentsApi } from '../../services/commentService';
import { config } from '../../config/config';
import type { CommentItemProps } from './taskDrawer.type';
import { formatDistanceToNow } from 'date-fns';

const { Text } = Typography;
const { TextArea } = Input;

export function CommentItem({ comment, onDelete, onUpdate }: CommentItemProps) {
  const [messageApi, contextHolder] = message.useMessage();

  const [isEditing, setIsEditing] = useState(false);
  const [messageText, setMessageText] = useState(comment.message);
  const [, setSaving] = useState(false);

  const handleSave = async () => {
    if (!messageText.trim()) {
      messageApi.warning('Comment cannot be empty');
      return;
    }

    setSaving(true);
    try {
      const updated = await commentsApi.updateComment(
        comment.taskId as string,
        comment._id,
        {
          message: messageText,
        }
      );

      onUpdate({
        ...comment,
        ...updated,
        author: comment.author,
      });

      messageApi.success('Comment updated successfully');
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
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
                  <Button
                    icon={<PaperClipOutlined />}
                    type="text"
                    onClick={() =>
                      window.open(
                        `${config.api_base_url}/uploads/${comment.attachment}`,
                        '_blank'
                      )
                    }
                  />
                )}

                <Popconfirm
                  title="Are you sure you want to delete this comment?"
                  onConfirm={handleDelete}
                >
                  <Button danger type="text" icon={<DeleteOutlined />} />
                </Popconfirm>
              </Space>
            </Space>

            {/* {!isEditing && (
              <div className="text-[11px] text-gray-400 opacity-0 transition group-hover:opacity-100">
                Click to edit · Enter to save
              </div>
            )} */}

            {!isEditing ? (
              <div
                className="prose prose-sm max-w-none cursor-text rounded px-1 py-0.5 leading-snug hover:bg-gray-100"
                onClick={() => setIsEditing(true)}
                dangerouslySetInnerHTML={{
                  __html: marked.parse(comment.message),
                }}
              />
            ) : (
              <TextArea
                autoFocus
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                rows={3}
                onBlur={handleSave}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setIsEditing(false);
                    setMessageText(comment.message);
                  }
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    handleSave();
                  }
                }}
              />
            )}
          </Space>
        </div>
      </div>
    </>
  );
}
