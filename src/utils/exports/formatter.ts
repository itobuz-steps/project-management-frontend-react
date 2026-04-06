import type {
  BackendAttachment,
  TaskPopulated,
} from '../../services/types/tasks.types';

export const resolveName = (user?: { name?: string; email?: string } | null) =>
  user ? [user.name, ''].filter(Boolean).join(' ') || '—' : '—';

export const resolveEmail = (user?: { email?: string } | null) =>
  user?.email ?? '—';

export const resolveProjectId = (project: TaskPopulated['projectId']) =>
  typeof project === 'string' ? project : (project._id ?? project.name ?? '—');

export const resolveProjectName = (project: TaskPopulated['projectId']) =>
  typeof project === 'string' ? project : (project.name ?? project._id ?? '—');

export const fmt = (date?: string | null) =>
  date
    ? new Date(date).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—';

export const fmtSize = (bytes?: number) => {
  if (bytes == null) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1_048_576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1_048_576).toFixed(1)} MB`;
};

export const str = (v: string | number | undefined | null) =>
  v != null && v !== '' ? String(v) : '—';

export const xmlEsc = (v: string) =>
  v
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

export const xe = (v: string | number | undefined | null) =>
  xmlEsc(v != null && v !== '' ? String(v) : '');

export interface ResolvedAttachment {
  name: string;
  mimeType: string;
  size: string;
  url: string;
}

export const resolveAttachment = (
  attachment: File | string | BackendAttachment
): ResolvedAttachment => {
  if (typeof attachment === 'string')
    return { name: '—', mimeType: '—', size: '—', url: attachment };
  if (attachment instanceof File)
    return {
      name: attachment.name,
      mimeType: attachment.type,
      size: fmtSize(attachment.size),
      url: '—',
    };
  return {
    name: attachment.name,
    mimeType: attachment.mimeType,
    size: fmtSize(attachment.size),
    url: attachment.url,
  };
};

export const toFileName = (title?: string | null) =>
  (title ?? 'task')
    .replace(/[^a-z0-9_\-\s]/gi, '')
    .trim()
    .replace(/\s+/g, '_')
    .slice(0, 50) || 'task';
