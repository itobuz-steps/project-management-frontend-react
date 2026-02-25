import { Bug, FileText, Tag } from 'lucide-react';
import type { TaskType } from '../services/types/tasks.types';

export function TaskTypeIcon({ type }: { type: TaskType }) {
  switch (type) {
    case 'bug':
      return <Bug className="h-4 w-4 text-red-500 items-center" />;
    case 'story':
      return <Tag className="h-4 w-4 text-green-600" />;
    default:
      return <FileText className="text-primary-600 h-4 w-4 self-center" />;
  }
}
