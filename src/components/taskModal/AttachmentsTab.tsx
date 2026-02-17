import { useMemo, useState } from 'react';
import { Empty, Typography, Button, Upload, message } from 'antd';
import type { UploadProps } from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  DownOutlined,
  RightOutlined,
} from '@ant-design/icons';
import type {
  TaskAttachment,
  TaskPopulated,
} from '../../services/types/tasks.types';
import { updateTask } from '../../services/taskService';
import { config } from '../../config/config';

const { Link, Text } = Typography;

export function AttachmentsTab({
  task,
  onUpdated,
}: {
  task: TaskPopulated;
  onUpdated?: (task: TaskPopulated) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const [saving, setSaving] = useState(false);

  const attachments = useMemo<TaskAttachment[]>(() => {
    if (!task.attachments) {
      return [];
    }

    return Array.isArray(task.attachments)
      ? task.attachments
      : Array.from(task.attachments);
  }, [task.attachments]);

  const uploadProps: UploadProps = {
    multiple: true,
    showUploadList: false,
    beforeUpload: async (file) => {
      const updated = [...attachments, file];

      setSaving(true);
      onUpdated?.({ ...task, attachments: updated });

      try {
        await updateTask(task._id, { attachments: updated });
        message.success('Attachment added');
      } catch {
        message.error('Failed to add attachment');
        onUpdated?.(task);
      } finally {
        setSaving(false);
      }

      return false;
    },
  };

  const removeAttachment = async (target: TaskAttachment) => {
    const updated = attachments.filter((attachment) => attachment !== target);

    setSaving(true);
    onUpdated?.({ ...task, attachments: updated });

    try {
      await updateTask(task._id, { attachments: updated });
      message.success('Attachment removed');
    } catch {
      message.error('Failed to remove attachment');
      onUpdated?.(task);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="my-4">
      {/* Header */}
      <div
        className="flex cursor-pointer items-center justify-between text-sm font-semibold text-gray-700 hover:text-gray-900"
        onClick={() => setExpanded((dropdown) => !dropdown)}
      >
        <div className="flex items-center gap-2">
          {expanded ? <DownOutlined /> : <RightOutlined />}
          <span>Attachments</span>
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

      {/* Body */}
      {expanded && (
        <div className="mt-1 ml-4">
          {!attachments.length ? (
            <Empty description="No attachments yet" />
          ) : (
            <div className="space-y-2">
              {attachments.map((attachment) => {
                const isFile = attachment instanceof File;

                const name = isFile ? attachment.name : attachment;

                const url = isFile
                  ? URL.createObjectURL(attachment)
                  : `${config.api_base_url}/uploads/attachments/${attachment}`;

                return (
                  <div
                    key={`${name}-${isFile ? attachment.size : 'server'}`}
                    className="group flex items-center justify-between rounded-md bg-gray-100 px-3 py-2 hover:bg-gray-50"
                  >
                    <Link href={url} target="_blank">
                      <Text>{name}</Text>
                    </Link>

                    <Button
                      type="text"
                      danger
                      size="small"
                      icon={<DeleteOutlined />}
                      className="opacity-0 group-hover:opacity-100"
                      onClick={() => removeAttachment(attachment)}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
