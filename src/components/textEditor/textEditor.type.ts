import type { SelectProps } from 'antd';
import type { JSONContent } from '@tiptap/react';
import type { TaskType } from '../../services/types/tasks.types';

export type TextEditorProps = {
  comment: boolean;
  content: string;
  onChange: (html: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onAttachmentsChange?: (files: File[]) => void;
  disabled?: boolean;
  mentionItems?: { id: string; label: string }[];
  onEditorJsonChange?: (json: JSONContent) => void;
  taskItems?: TaskItem[];
};

export const headingOptions: SelectProps['options'] = [
  { label: 'Text', value: '' },
  ...[1, 2, 3, 4, 5, 6].map((l) => ({
    label: `Heading ${l}`,
    value: l,
  })),
];

export interface TaskItem {
  id: string;
  label: string;
  type: TaskType;
}
