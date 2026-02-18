import { useState } from 'react';
import { Button, Upload } from 'antd';
import type { UploadProps } from 'antd';
import { PlusOutlined, DownOutlined, RightOutlined } from '@ant-design/icons';
import type { AttachmentsTabProps } from './attachment.type';
import { useTaskAttachments } from '../../hooks/useTaskAttachments';
import { AttachmentItem } from '../attachment/AttachmentItem';
import { DataLoader } from '../ui/DataLoader';

export function AttachmentsTab({ task, onUpdated }: AttachmentsTabProps) {
  const [expanded, setExpanded] = useState(true);

  const { attachments, saving, addAttachment, removeAttachment } =
    useTaskAttachments(task, onUpdated);

  const uploadProps: UploadProps = {
    multiple: true,
    showUploadList: false,
    beforeUpload: async (file) => {
      addAttachment(file);
      return false;
    },
  };

  return (
    <div className="my-4">
      <div
        className="flex cursor-pointer items-center justify-between text-base font-semibold text-gray-900"
        onClick={() => setExpanded((dropdown) => !dropdown)}
      >
        <div className="flex items-center gap-2">
          {expanded ? <DownOutlined /> : <RightOutlined />}
          <span className="text-base">Attachments</span>
          <span className="font-bold">({attachments.length})</span>
        </div>

        <div onClick={(e) => e.stopPropagation()}>
          <Upload {...uploadProps} disabled={saving}>
            <Button size="small" icon={<PlusOutlined />}>
              Add
            </Button>
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
                      : attachment
                  }
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
