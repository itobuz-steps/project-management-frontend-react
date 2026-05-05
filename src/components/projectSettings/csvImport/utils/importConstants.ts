export const ALLOWED_IMPORT_HEADERS = [
  'title',
  'description',
  'type',
  'status',
  'priority',
  'tags',
  'duedate',
  'assignee',
] as const;

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const VALID_PRIORITIES = new Set(['low', 'medium', 'high', 'critical']);

export const MONTH_NAME_TO_INDEX: Record<string, number> = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dec: 11,
};
