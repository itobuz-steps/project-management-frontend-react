import { config } from '../../config/config';
import { Typography, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import type { AttachmentsItemProps } from './attachment.type';

const { Link, Text } = Typography;

export function AttachmentItem({ attachment, onRemove }: AttachmentsItemProps) {
  const isFile = attachment instanceof File;
  const name = isFile ? attachment.name : attachment;

  const url = isFile
    ? URL.createObjectURL(attachment)
    : `${config.api_base_url}/uploads/attachments/${attachment}`;

  return (
    <div className="group flex items-center justify-between rounded-md bg-gray-100 px-3 py-2 hover:bg-gray-50">
      <Link href={url} target="_blank">
        <Text>{name}</Text>
      </Link>

      <Button
        type="text"
        danger
        size="small"
        icon={<DeleteOutlined />}
        className="opacity-0 group-hover:opacity-100"
        onClick={onRemove}
      />
    </div>
  );
}
