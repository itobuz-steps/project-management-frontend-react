import { Bug, FileText, Layers } from 'lucide-react';

export function TaskTypeIcon({ type }: { type?: string }) {
  switch (type) {
    case 'bug':
      return <Bug className="h-4 w-4 text-red-500" />;
    case 'story':
      return <Layers className="h-4 w-4 text-green-600" />;
    default:
      return <FileText className="h-4 w-4 text-blue-600" />;
  }
}
