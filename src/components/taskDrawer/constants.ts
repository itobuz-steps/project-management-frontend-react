export const TASK_TYPES = ['task', 'story', 'bug'] as const;
export const PRIORITIES = ['low', 'medium', 'high', 'critical'] as const;
export type Priority = (typeof PRIORITIES)[number];
export const PRIORITY_COLORS: Record<Priority, string> = {
  critical: 'red',
  high: 'orange',
  medium: 'blue',
  low: 'green',
};