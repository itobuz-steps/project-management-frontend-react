import { Empty, Spin, Input, Button, Upload, message, Space } from 'antd';
import { SendOutlined, PaperClipOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { commentsApi } from '../../services/commentService';
import type { Comment } from '../../services/types/comments.types';
import { CommentItem } from './CommentItem';

const { TextArea } = Input;

interface CommentsTabProps {
  taskId: string;
}

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
      setComments((prev) => [...prev, newComment]);
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
      <div className="mb-4 border-b border-gray-200 pb-3">
        <Space orientation="vertical" className="w-full">
          <TextArea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Write a comment..."
            rows={3}
          />

          <Space className="w-full justify-between">
            <Upload
              beforeUpload={(file) => {
                setFile(file);
                return false;
              }}
              maxCount={1}
              showUploadList={false}
            >
              <Button icon={<PaperClipOutlined />}>Attach</Button>
            </Upload>

            <Button
              type="primary"
              icon={<SendOutlined />}
              loading={submitting}
              onClick={handleSubmit}
            >
              Send
            </Button>
          </Space>
        </Space>
      </div>

      {/* Comments */}
      {loading ? (
        <Spin />
      ) : !comments.length ? (
        <Empty description="No comments yet" />
      ) : (
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
