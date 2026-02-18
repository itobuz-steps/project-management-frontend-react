import { useEditor } from '@tiptap/react';
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
import { Markdown } from 'tiptap-markdown';

export function useTextEditor({
  content,
  disabled,
  onChange,
}: {
  content: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}) {
  return useEditor({
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
      Markdown,
    ],
    content,
    editable: !disabled,
    autofocus: true,
    onUpdate({ editor }) {
      onChange(editor.storage.markdown.getMarkdown());
    },
  });
}
