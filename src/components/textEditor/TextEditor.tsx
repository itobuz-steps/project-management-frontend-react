import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Link from '@tiptap/extension-link';
import Mention from '@tiptap/extension-mention';
import Placeholder from '@tiptap/extension-placeholder';
import { TextStyle } from '@tiptap/extension-text-style';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import Emoji from '@tiptap/extension-emoji';
import type { Level } from '@tiptap/extension-heading';
import { Upload, Button, message, Select } from 'antd';
import { PaperClipOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { headingOptions, type TextEditorProps } from './textEditor.type';
import { Link as RouterLink } from 'react-router-dom';

export function TextEditor({
  comment,
  content,
  onChange,
  onSave,
  onCancel,
  onAttachmentsChange,
  disabled,
}: TextEditorProps) {
  const [attachments, setAttachments] = useState<{ file: File; url: string }[]>(
    []
  );

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: {} }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Link.configure({ openOnClick: false }),
      TextStyle,
      Emoji,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Mention.configure({
        HTMLAttributes: {
          class: 'text-blue-600 font-medium',
        },
        suggestion: {
          items: ({ query }) =>
            ['@John', '@Jane', '@Team'].filter((item) =>
              item.toLowerCase().includes(query.toLowerCase())
            ),
        },
      }),
      Placeholder.configure({
        placeholder: 'Add a description…',
      }),
    ],
    content,
    editable: !disabled,
    autofocus: true,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
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
            } else {
              editor
                .chain()
                .focus()
                .toggleHeading({ level: Number(value) as Level })
                .run();
            }
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
          className={`${btn} ${comment ? 'block' : 'hidden'}`}
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
        className="prose prose-sm max-w-none p-3 text-gray-800 focus:outline-none"
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            // e.preventDefault();
            onCancel();
          }
          if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
            // e.preventDefault();
            onSave();
          }
        }}
      />

      {/* Attachments below editor */}
      {attachments.length > 0 && (
        <div className="mt-2 flex flex-col gap-1 px-4">
          {attachments.map((attachment, idx) => (
            <div
              key={idx}
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
      )}
    </div>
  );
}
