import { Typography, Button } from 'antd';
import {
  DeleteOutlined,
  FilePdfOutlined,
  FileOutlined,
} from '@ant-design/icons';
import type { AttachmentsItemProps } from './attachment.type';
import type { BackendAttachment } from '../../services/types/tasks.types';

const { Link, Text } = Typography;

export function AttachmentItem({
  isDrawer,
  attachment,
  onRemove,
}: AttachmentsItemProps) {
  const isFileAttachment = (a: unknown): a is File => a instanceof File;
  const isBackendAttachment = (a: unknown): a is BackendAttachment =>
    Boolean(
      a &&
      typeof a === 'object' &&
      'url' in (a as object) &&
      'name' in (a as object)
    );

  let name: string;
  let url: string;
  let mimeType = '';

  if (isFileAttachment(attachment)) {
    name = attachment.name;
    url = URL.createObjectURL(attachment);
    mimeType = attachment.type || '';
  } else if (isBackendAttachment(attachment)) {
    name = attachment.name;
    url = attachment.url;
    mimeType = attachment.mimeType || '';
  } else {
    name = String(attachment);
    url = String(attachment);
  }

  const extension = name.split('.').pop()?.toLowerCase();

  const isImage =
    mimeType.startsWith('image/') ||
    ['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(extension || '');

  const isPdf = mimeType === 'application/pdf' || extension === 'pdf';

  const renderPreview = () => {
    if (isImage) {
      return (
        <img
          src={url}
          alt={name}
          className="hover: h-10 w-10 transform rounded border object-cover hover:scale-150"
        />
      );
    }

    if (isPdf) {
      return (
        <div className="flex h-10 w-10 items-center justify-center rounded bg-white">
          <FilePdfOutlined style={{ fontSize: 20, color: '#ff4d4f' }} />
        </div>
      );
    }

    return (
      <div className="flex h-10 w-10 items-center justify-center rounded bg-white">
        <FileOutlined style={{ fontSize: 18 }} />
      </div>
    );
  };

  return (
    <div className="group flex items-center justify-between rounded-md bg-gray-100 px-3 py-2 hover:bg-gray-50">
      <div className="flex items-center gap-3">
        {renderPreview()}

        <Link href={url} target="_blank">
          <Text>
            <div
              className={`${isDrawer ? 'max-w-60' : 'max-w-50 md:max-w-80 lg:max-w-120'} truncate`}
            >
              {name}
            </div>
          </Text>
        </Link>
      </div>

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
