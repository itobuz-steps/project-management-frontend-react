export function getPriorityBorder(priority?: string) {
  switch (priority) {
    case 'critical':
      return 'border-l-2 border-l-red-600';
    case 'high':
      return 'border-l-2 border-l-yellow-500';
    case 'medium':
      return 'border-l-2 border-l-blue-500';
    case 'low':
      return 'border-l-2 border-l-green-500';
    default:
      return 'border-l-2 border-l-transparent';
  }
}
