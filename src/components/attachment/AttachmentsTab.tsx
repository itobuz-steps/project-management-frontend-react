import { useState } from 'react';
import { Button, Upload } from 'antd';
import { message } from 'antd';
import type { UploadProps } from 'antd';
import type { BackendAttachment } from '../../services/types/tasks.types';
import { PlusOutlined, DownOutlined, RightOutlined } from '@ant-design/icons';
import type { AttachmentsTabProps } from './attachment.type';
import { allowedTypes, allowedExtensions } from './attachment.type';
import { useTaskAttachments } from '../../hooks/useTaskAttachments';
import { AttachmentItem } from '../attachment/AttachmentItem';
import { DataLoader } from '../ui/DataLoader';

export function AttachmentsTab({
  isDrawer,
  task,
  onUpdated,
}: AttachmentsTabProps) {
  const [expanded, setExpanded] = useState(false);

  const { attachments, saving, addAttachment, removeAttachment } =
    useTaskAttachments(task, onUpdated);

  const uploadProps: UploadProps = {
    multiple: false,
    showUploadList: false,
    beforeUpload: (uploadFile) => {
      setExpanded(true);

      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

      const file = uploadFile as File;
      const type = file.type || '';
      const extension = file.name.split('.').pop()?.toLowerCase() || '';

      if (file.size > MAX_FILE_SIZE) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
        message.error(
          `"${file.name}" is ${sizeMB}MB. Max allowed size is 5MB.`
        );
        return false;
      }

      if (
        !allowedTypes.includes(type) &&
        !allowedExtensions.includes(extension)
      ) {
        message.error(`File type not allowed: ${file.name}`);
        return false;
      }

      addAttachment(file);
      return false;
    },
  };

  return (
    <div className="py-3">
      <div
        className="flex cursor-pointer items-center justify-between text-base font-semibold text-gray-900"
        onClick={() => setExpanded((dropdown) => !dropdown)}
      >
        <div className="flex items-center gap-2">
          {expanded ? <DownOutlined /> : <RightOutlined />}
          <span className="text-base">Attachments ({attachments.length})</span>
        </div>

        <div
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(true);
          }}
        >
          <span className="pr-2 text-[10px] font-normal text-red-400 sm:text-xs">
            Max size: 5MB
          </span>
          <Upload {...uploadProps} disabled={saving}>
            <Button
              style={{
                border: 'var(--color-primary-500) solid 1px',
              }}
              type="text"
              size="small"
              icon={<PlusOutlined />}
            ></Button>
          </Upload>
        </div>
      </div>

      {expanded && (
        <div className="mt-1 ml-4">
          <DataLoader
            loading={saving}
            isEmpty={!attachments.length}
            emptyText="No attachments yet"
          >
            <div className="space-y-2">
              {attachments.map((attachment) => (
                <AttachmentItem
                  key={
                    attachment instanceof File
                      ? `${attachment.name}-${attachment.size}`
                      : typeof attachment === 'string'
                        ? attachment
                        : (attachment as BackendAttachment).key
                  }
                  isDrawer={isDrawer}
                  attachment={attachment}
                  onRemove={() => removeAttachment(attachment)}
                />
              ))}
            </div>
          </DataLoader>
        </div>
      )}
    </div>
  );
}
