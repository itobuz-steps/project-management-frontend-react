import { Node, mergeAttributes } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';

export const TaskLink = Node.create({
  name: 'taskLink',
  inline: true,
  group: 'inline',
  atom: true,

  addOptions() {
    return {
      suggestion: {
        char: '#',
      },
    };
  },

  addAttributes() {
    return {
      id: { default: null },
      label: { default: null },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-task-id]',
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(HTMLAttributes, {
        'data-task-id': node.attrs.id,
        class: 'text-purple-600 font-medium cursor-pointer',
      }),
      `#${node.attrs.label}`,
    ];
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});
