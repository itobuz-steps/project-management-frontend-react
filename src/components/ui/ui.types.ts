import type { ReactNode } from 'react';
import type { TaskPopulated, User } from '../../services/types/tasks.types';
import type { SuggestionKeyDownProps } from '@tiptap/suggestion';
import type { TaskItem } from '../textEditor/textEditor.type';

export type AssigneeCellType = {
  task: TaskPopulated;
  members: User[];
  loading: boolean;
  onUpdated: (t: TaskPopulated) => void;
  loadMembers?: () => void;
  field?: 'assignee' | 'reporter';
};

export type DueDateCellType = {
  dueDate?: string;
  onChange: (date: string) => void;
  isCompleted?: boolean;
};

export type SidebarRowType = {
  label?: string;
  children: React.ReactNode;
};

export type StatusSelectType = {
  value: string;
  columns: string[];
  onChange: (value: string) => void;
  className?: string;
};

export type TaskKeyCellType = {
  taskId: string;
  type: string;
  taskKey: string;
};

export type TaskTitleCellType = {
  title: string;
  taskId: string;
  isCompleted: boolean;
};

export type UserCellType = {
  user?: User;
  emptyText: string;
};

export type DataLoaderProps = {
  loading: boolean;
  isEmpty: boolean;
  emptyText?: string;
  children: ReactNode;
};

export type MentionItem = {
  id: string;
  label: string;
  avatar?: string;
};

export type MentionListProps = {
  items: MentionItem[];
  command: (item: MentionItem) => void;
};

export type MentionListRef = {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean;
};

export type TaskMentionListRef = {
  onKeyDown: (props: SuggestionKeyDownProps) => boolean;
};

export type TaskMentionListProps = {
  items: TaskItem[];
  command: (item: TaskItem) => void;
};
