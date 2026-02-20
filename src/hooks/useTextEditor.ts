import { useEditor, ReactRenderer } from '@tiptap/react';
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
import { MentionList } from '../components/ui/MentionList';
import type { SuggestionProps } from '@tiptap/suggestion';
import type { MentionListRef } from '../components/ui/ui.types';
import type { UseTextEditorParams } from './hooks.types';

export function useTextEditor({
  content,
  disabled,
  onChange,
  enableMentions = false,
  mentionItems = [],
}: UseTextEditorParams) {
  const mentionExtension = enableMentions
    ? Mention.configure({
        HTMLAttributes: {
          class: 'text-blue-600 font-medium',
        },
        suggestion: {
          items: ({ query }) =>
            mentionItems.filter((item) =>
              item.label.toLowerCase().includes(query.toLowerCase())
            ),

          render: () => {
            let component: ReactRenderer<MentionListRef>;
            let container: HTMLDivElement;

            return {
              onStart: (props) => {
                component = new ReactRenderer(MentionList, {
                  props,
                  editor: props.editor,
                });

                container = document.createElement('div');
                container.style.position = 'absolute';
                container.style.zIndex = '1000';

                document.body.appendChild(container);
                container.appendChild(component.element);

                updatePosition(props);
              },

              onUpdate(props) {
                component.updateProps(props);
                updatePosition(props);
              },

              onKeyDown(props) {
                return component.ref?.onKeyDown(props) ?? false;
              },

              onExit() {
                component.destroy();
                container.remove();
              },
            };

            function updatePosition(props: SuggestionProps) {
              const rect = props.clientRect?.();
              if (!rect) {
                return;
              }

              container.style.left = `${rect.left}px`;
              container.style.top = `${rect.bottom + 4}px`;
            }
          },
        },
      })
    : null;

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
      ...(mentionExtension ? [mentionExtension] : []),
      Placeholder.configure({
        placeholder: enableMentions ? 'Add a comment…' : 'Add a description…',
      }),
      Markdown,
    ],
    content,
    editable: !disabled,
    autofocus: true,
    onUpdate({ editor }) {
      onChange(editor.storage.markdown.getMarkdown(), editor.getJSON());
    },
  });
}
