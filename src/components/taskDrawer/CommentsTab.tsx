import { Empty, Spin, Input, Button, Upload, message, Space } from 'antd';
import { SendOutlined, PaperClipOutlined, DeleteOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { commentsApi } from '../../services/commentService';
import type { Comment } from '../../services/types/comments.types';
import { CommentItem } from './CommentItem';
import type { CommentsTabProps } from './taskDrawer.type';

const { TextArea } = Input;

export function CommentsTab({ taskId }: CommentsTabProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (!taskId) return;

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

  const handleSubmit = async () => {
    if (!messageText.trim()) {
      messageApi.warning('Comment cannot be empty');
      return;
    }

    const formData = new FormData();
    formData.append('taskId', taskId);
    formData.append('message', messageText);

    if (file) {
      formData.append('attachment', file);
    }

    setSubmitting(true);
    try {
      const newComment = await commentsApi.createComment(formData);
      setComments((prev) => [
        ...prev,
        {
          ...newComment,
          author: newComment.author ?? {
            name: 'You',
          },
        },
      ]);
      setMessageText('');
      setFile(null);
      messageApi.success('Comment added');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {contextHolder}

      {/* Comment input */}
      <div className="mb-0 border-b border-gray-200 pb-3">
        <Space orientation="vertical" className="w-full">
          <TextArea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Write a comment..."
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          {file && (
            <div className="flex items-center justify-between rounded-md bg-gray-50 px-2 py-1 text-xs">
              <span className="truncate text-gray-700">📎 {file.name}</span>

              <Button size="small" type="text" onClick={() => setFile(null)}>
                <DeleteOutlined/>
              </Button>
            </div>
          )}

          <Space className="w-full justify-between">
            <Upload
              beforeUpload={(file) => {
                setFile(file);
                return false;
              }}
              maxCount={1}
              showUploadList={false}
            >
              <Button
                style={{
                  backgroundColor: 'var(--color-primary-500)',
                  color: 'white',
                }}
                icon={<PaperClipOutlined />}
              >
                Attach
              </Button>
            </Upload>

            <Button
              type="primary"
              icon={<SendOutlined />}
              loading={submitting}
              onClick={handleSubmit}
              style={{ backgroundColor: 'var(--color-primary-500)' }}
            >
              Send
            </Button>
          </Space>
        </Space>
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
                setComments((prev) => prev.filter((c) => c._id !== id))
              }
              onUpdate={(updated) =>
                setComments((prev) =>
                  prev.map((c) => (c._id === updated._id ? updated : c))
                )
              }
            />
          ))}
        </div>
      )}
    </>
  );
}
