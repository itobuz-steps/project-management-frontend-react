import type { JSONContent } from '@tiptap/react';
export function extractMentions(editorJson: JSONContent | null) {
  if (!editorJson) {
    return [];
  }

  const ids = new Set<string>();

  const walk = (node: JSONContent) => {
    if (node.type === 'mention' && node.attrs?.id) {
      ids.add(node.attrs.id);
    }

    node.content?.forEach(walk);
  };

  walk(editorJson);
  return Array.from(ids);
}
