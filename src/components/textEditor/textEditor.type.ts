export type TextEditorProps = {
  comment: boolean;
  content: string;
  onChange: (html: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onAttachmentsChange?: (files: File[]) => void;
  disabled?: boolean;
};
