import type { TaskType } from '../services/types/tasks.types';
import { ALLOWED_CHILD_TYPES } from '../config/constants';

export function getAllowedChildTaskTypes(
  parentType?: string | null
): TaskType[] {
  if (!parentType) {
    // No parent - root level tasks can be any type
    return ['epic', 'story', 'task', 'bug'] as TaskType[];
  }

  const normalizedType = (parentType ?? '').toLowerCase();
  return (ALLOWED_CHILD_TYPES[normalizedType] ?? ['task']) as TaskType[];
}
