import type {
  TaskAttachment,
  TaskPopulated,
} from '../../services/types/tasks.types';

export interface AttachmentsTabProps {
  isDrawer?: boolean;
  task: TaskPopulated;
  onUpdated: (task: TaskPopulated) => void;
}

export interface AttachmentsItemProps {
  isDrawer?: boolean;
  attachment: TaskAttachment;
  onRemove: () => void;
}

export const allowedTypes = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
];

export const allowedExtensions = [
  'jpg',
  'jpeg',
  'png',
  'gif',
  'webp',
  'pdf',
  'doc',
  'docx',
  'xls',
  'xlsx',
  'txt',
];
