import type { Comment } from '../services/types/comments.types';
import type { TaskPopulated } from '../services/types/tasks.types';
import type { JSONContent } from '@tiptap/react';

export interface UseCommentEditorParams {
  comment: Comment;
  onUpdate: (comment: Comment) => void;
  onDelete: (id: string) => void;
}

export type OnUpdatedFn = (updated: TaskPopulated) => void;

export interface MentionItem {
  id: string;
  label: string;
}

export interface UseTextEditorParams {
  content: string;
  disabled?: boolean;
  onChange: (value: string, json: JSONContent) => void;
  enableMentions?: boolean;
  mentionItems?: MentionItem[];
}
