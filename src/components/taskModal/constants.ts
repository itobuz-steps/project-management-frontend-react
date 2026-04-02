export const TASK_TYPES = ['task', 'story', 'bug', 'epic'] as const;
export const PRIORITIES = ['low', 'medium', 'high', 'critical'] as const;
export type Priority = (typeof PRIORITIES)[number];
export const PRIORITY_COLORS: Record<Priority, string> = {
  critical: 'red',
  high: 'orange',
  medium: 'cyan',
  low: 'green',
};

export const STATUS_COLORS: Record<string, string> = {
  todo: '#94a3b8',
  'in-progress': '#3b82f6',
  review: '#f59e0b',
  done: '#22c55e',
  DEPLOYMENT: '#8b5cf6',
};

export const STORY_POINTS = [1, 2, 3, 5, 8, 13];

export const COMMENT_TEMPLATES = [
  'Who is working on this?',
  'Status update:',
  'Thanks!',
];
