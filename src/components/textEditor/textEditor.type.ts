import type { SelectProps } from 'antd';
import type { JSONContent } from '@tiptap/react';

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
};

export const headingOptions: SelectProps['options'] = [
  { label: 'Text', value: '' },
  ...[1, 2, 3, 4, 5, 6].map((l) => ({
    label: `Heading ${l}`,
    value: l,
  })),
];
