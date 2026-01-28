import { Empty, List, Typography, Space } from 'antd';
import { PaperClipOutlined } from '@ant-design/icons';
import { config } from '../../config/config';
import type { Task } from '../../types/tasks.types';

const { Text, Link } = Typography;

interface AttachmentsTabProps {
  task: Task;
}

export function AttachmentsTab({ task }: AttachmentsTabProps) {
  const attachments = Array.isArray(task.attachments)
    ? task.attachments
    : task.attachments
      ? Array.from(task.attachments)
      : [];

  if (!attachments.length) {
    return <Empty description="No attachments yet" />;
  }

  return (
    <List
      dataSource={attachments}
      renderItem={(file) => {
        const fileName = typeof file === 'string' ? file : file.name;
        const fileUrl = `${config.api_base_url}/uploads/attachments/${fileName}`;

        return (
          <List.Item>
            <Space>
              <PaperClipOutlined />
              <Link href={fileUrl} target="_blank" rel="noopener noreferrer">
                <Text ellipsis style={{ maxWidth: 300 }}>
                  {fileName}
                </Text>
              </Link>
            </Space>
          </List.Item>
        );
      }}
    />
  );
}
