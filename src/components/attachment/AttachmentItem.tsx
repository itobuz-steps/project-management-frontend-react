import { Typography, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import type { AttachmentsItemProps } from './attachment.type';

const { Link, Text } = Typography;

export function AttachmentItem({
  isDrawer,
  attachment,
  onRemove,
}: AttachmentsItemProps) {
  const isFile = attachment instanceof File;
  const name = isFile ? attachment.name : attachment;

  const url = isFile ? URL.createObjectURL(attachment) : attachment;

  return (
    <div className="group flex items-center justify-between rounded-md bg-gray-100 px-3 py-2 hover:bg-gray-50">
      <Link href={url} target="_blank">
        <Text>
          <div className={`${isDrawer ? 'max-w-60' : 'max-w-50 md:max-w-80 lg:max-w-120'} truncate`}>
            {name}
          </div>
        </Text>
      </Link>

      <Button
        type="text"
        danger
        size="small"
        icon={<DeleteOutlined />}
        className="group-hover:bg-red-300"
        onClick={onRemove}
      />
    </div>
  );
}
