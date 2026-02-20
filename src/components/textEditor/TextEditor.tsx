import { EditorContent } from '@tiptap/react';
import type { Level } from '@tiptap/extension-heading';
import { Upload, Button, message, Select } from 'antd';
import { PaperClipOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { headingOptions, type TextEditorProps } from './textEditor.type';
import { Link as RouterLink } from 'react-router-dom';
import { useTextEditor } from '../../hooks/useTextEditor';

export function TextEditor({
  comment,
  content,
  onChange,
  onSave,
  onCancel,
  onAttachmentsChange,
  disabled,
  mentionItems,
  onEditorJsonChange,
}: TextEditorProps) {
  const [attachments, setAttachments] = useState<{ file: File; url: string }[]>(
    []
  );

  const editor = useTextEditor({
    content,
    disabled,
    enableMentions: comment,
    mentionItems,
    onChange: (markdown, json) => {
      onChange(markdown);
      onEditorJsonChange?.(json);
    },
  });

  if (!editor) {
    return null;
  }

  const btn =
    'h-8 min-w-[32px] rounded-md px-2 text-sm font-medium text-gray-700 hover:bg-gray-100 active:bg-gray-200';
  const btnActive = 'bg-gray-200 text-gray-900';

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50 p-2">
        {/* Headings */}
        <Select
          size="small"
          className="w-32"
          options={headingOptions}
          placeholder="Text"
          onChange={(value) => {
            if (!value) {
              editor.chain().focus().setParagraph().run();
            }

            editor
              .chain()
              .focus()
              .toggleHeading({ level: Number(value) as Level })
              .run();
          }}
        />

        <div className="mx-1 h-5 w-px bg-gray-300" />

        <Button
          size="small"
          title="Bold"
          className={`${btn} ${editor.isActive('bold') ? btnActive : ''}`}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          B
        </Button>

        <Button
          size="small"
          title="Italic"
          className={`${btn} ${editor.isActive('italic') ? btnActive : ''}`}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          I
        </Button>

        <div className="mx-1 h-5 w-px bg-gray-300" />

        <Button
          size="small"
          title="Bullet List"
          className={`${btn} ${editor.isActive('bulletList') ? btnActive : ''}`}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          •
        </Button>

        <Button
          size="small"
          title="Numbered List"
          className={`${btn} ${
            editor.isActive('orderedList') ? btnActive : ''
          }`}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1.
        </Button>

        <Button
          size="small"
          title="Check Box"
          className={`${btn} ${editor.isActive('taskList') ? btnActive : ''}`}
          onClick={() => editor.chain().focus().toggleTaskList().run()}
        >
          ☑
        </Button>

        <div className="mx-1 h-5 w-px bg-gray-300" />

        {/* Attach Upload */}
        {comment && (
          <Upload
            beforeUpload={(file) => {
              const url = URL.createObjectURL(file);
              setAttachments([{ file, url }]);
              onAttachmentsChange?.([file]);
              message.success(`${file.name} attached`);
              return false;
            }}
            maxCount={1}
            showUploadList={false}
          >
            <Button
              size="small"
              style={{ backgroundColor: 'transparent' }}
              icon={<PaperClipOutlined />}
            >
              Attach
            </Button>
          </Upload>
        )}

        <Button
          size="small"
          title="Mentions"
          className={`${btn} ${comment ? 'block' : 'hidden!'}`}
          onClick={() => editor.chain().focus().insertContent('@').run()}
        >
          @
        </Button>

        <Button
          size="small"
          title="Emoji"
          className={btn}
          onClick={() => editor.chain().focus().insertContent('😊').run()}
        >
          🙂
        </Button>

        <Button
          size="small"
          title="3x3 Table"
          className={btn}
          onClick={() =>
            editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run()
          }
        >
          ▦
        </Button>

        <Button
          size="small"
          title="Code"
          className={`${btn} ${editor.isActive('codeBlock') ? btnActive : ''}`}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          {'</>'}
        </Button>
      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        className="editor-prose prose focus:outline-none"
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            onCancel();
          }
          if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
            onSave();
          }
        }}
      />

      {/* Attachments below editor */}
      <div className="mt-2 flex flex-col gap-1 px-4">
        {attachments.map((attachment, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-md bg-gray-50 px-2 py-1 text-sm"
          >
            <RouterLink
              to={attachment.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 truncate text-gray-700"
            >
              <PaperClipOutlined />
              <span className="truncate">{attachment.file.name}</span>
            </RouterLink>

            <Button
              size="small"
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => {
                setAttachments([]);
                onAttachmentsChange?.([]);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
