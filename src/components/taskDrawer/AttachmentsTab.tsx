import { Empty, List, Typography, Space, Card, Tooltip, Button } from 'antd';
import {
  PaperClipOutlined,
  DownloadOutlined,
  FileOutlined,
} from '@ant-design/icons';
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
      <div className="flex justify-center py-10">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No attachments yet"
        />
      </div>
    );
  }

  return (
    <Card
      size="small"
      title={
        <Space>
          <PaperClipOutlined />
          <span>Attachments</span>
        </Space>
      }
      bordered={false}
      className="shadow-sm"
    >
      <List
        itemLayout="horizontal"
        dataSource={attachments}
        renderItem={(file) => {
          const fileName = typeof file === 'string' ? file : file.name;
          const fileUrl = `${config.api_base_url}/uploads/attachments/${fileName}`;

          return (
            <List.Item
              className="rounded-md px-2 hover:bg-gray-50"
              actions={[
                <Tooltip title="Open">
                  <Button
                    type="text"
                    icon={<DownloadOutlined />}
                    href={fileUrl}
                    target="_blank"
                  />
                </Tooltip>,
              ]}
            >
              <List.Item.Meta
                avatar={<FileOutlined className="text-lg text-blue-500" />}
                title={
                  <Link
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Text ellipsis style={{ maxWidth: 360 }}>
                      {fileName}
                    </Text>
                  </Link>
                }
              />
            </List.Item>
          );
        }}
      />
    </Card>
  );
}
