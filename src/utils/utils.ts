export function getPriorityBorder(priority?: string) {
  switch (priority) {
    case 'critical':
      return 'border-l-2 border-l-red-600';
    case 'high':
      return 'border-l-2 border-l-yellow-500';
    case 'medium':
      return 'border-l-2 border-l-primary-500';
    case 'low':
      return 'border-l-2 border-l-green-500';
    default:
      return 'border-l-2 border-l-transparent';
  }
}

export function getTypeBorder(type?: string) {
  switch (type) {
    case 'bug':
      return 'border-l-2 border-l-red-500';
    case 'task':
      return 'border-l-2 border-l-blue-500';
    case 'story':
      return 'border-l-2 border-l-green-500';
    default:
      return 'border-l-2 border-l-transparent';
  }
}

export function formatDateForInput(date?: string) {
  if (!date) {
    return '';
  }
  return new Date(date).toISOString().split('T')[0];
}

export function positionDropdown(
  container: HTMLDivElement,
  rect: DOMRect,
  width = 260
) {
  const padding = 8;

  let left = rect.left;
  let top = rect.bottom + 4;

  if (left + width > window.innerWidth) {
    left = window.innerWidth - width - padding;
  }

  left = Math.max(padding, left);

  if (top + 300 > window.innerHeight) {
    top = rect.top - 8;
    container.style.transform = 'translateY(-100%)';
  } else {
    container.style.transform = 'none';
  }

  container.style.left = `${left}px`;
  container.style.top = `${top}px`;
}

export const normalizeAndCapitalize = (text: string) =>
  text.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
