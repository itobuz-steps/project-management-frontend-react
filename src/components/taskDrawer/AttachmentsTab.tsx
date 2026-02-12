import { Empty, List, Typography, Space, Card } from 'antd';
import { PaperClipOutlined, FileOutlined } from '@ant-design/icons';
import { config } from '../../config/config';
import type { AttachmentsTabProps } from './taskDrawer.type';

const { Text, Link } = Typography;

export function AttachmentsTab({ task }: AttachmentsTabProps) {
  const attachments = Array.isArray(task.attachments)
    ? task.attachments
    : task.attachments
      ? Array.from(task.attachments)
      : [];

  if (!attachments.length) {
    return (
      <div className="flex justify-center py-2">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No attachments yet"
        />
      </div>
    );
  }

  return (
    <div className="py-3">
      <Card
        size="small"
        title={
          <Space>
            <PaperClipOutlined />
            <span>Attachments</span>
          </Space>
        }
        className="shadow-sm"
      >
        <List
          itemLayout="horizontal"
          dataSource={attachments}
          renderItem={(file) => {
            const fileName = typeof file === 'string' ? file : file.name;
            const fileUrl = `${config.api_base_url}/uploads/${fileName}`;

            return (
              <List.Item className="rounded-md px-6 hover:bg-gray-50">
                <List.Item.Meta
                  avatar={<FileOutlined className="text-primary-500 text-lg" />}
                  title={
                    <Link
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Text>{fileName}</Text>
                    </Link>
                  }
                />
              </List.Item>
            );
          }}
        />
      </Card>
    </div>
  );
}
