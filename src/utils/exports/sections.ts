import type { TaskPopulated } from '../../services/types/tasks.types';
import {
  fmt,
  resolveAttachment,
  resolveEmail,
  resolveName,
  resolveProjectId,
  resolveProjectName,
  str,
} from './formatter';

export interface TaskExportSections {
  core: [string, string][];
  people: [string, string][];
  dates: [string, string][];
  subTasks: string[][];
  attachments: string[][];
  blocks: string[][];
  blockedBy: string[][];
  relatesTo: string[][];
  duplicates: string[][];
}

const toRefRows = (refs?: TaskPopulated['blocks']): string[][] =>
  (refs ?? []).map((r) => [r._id, r.key ?? '—', r.title, r.status, r.type]);

export function buildSections(task: TaskPopulated): TaskExportSections {
  return {
    core: [
      ['ID', str(task._id)],
      ['Key', str(task.key)],
      ['Title', str(task.title)],
      ['Description', str(task.description)],
      ['Status', str(task.status)],
      ['Priority', str(task.priority)],
      ['Type', str(task.type)],
      ['Story Points', task.storyPoint != null ? String(task.storyPoint) : '—'],
      ['Labels', task.labels?.length ? task.labels.join(', ') : '—'],
      ['Tags', task.tags?.length ? task.tags.join(', ') : '—'],
      ['Due Date', fmt(task.dueDate)],
      ['Parent Task', str(task.parentTask)],
      ['Project ID', resolveProjectId(task.projectId)],
      ['Project Name', resolveProjectName(task.title)],
    ],
    people: [
      ['Assignee', resolveName(task.assignee)],
      ['Assignee Email', resolveEmail(task.assignee)],
      ['Reporter', resolveName(task.reporter)],
      ['Reporter Email', resolveEmail(task.reporter)],
    ],
    dates: [
      ['Created At', fmt(task.createdAt)],
      ['Updated At', fmt(task.updatedAt)],
    ],
    subTasks: (task.subTasks ?? []).map((id) => [id]),
    attachments: (task.attachments ?? []).map((a) => {
      const r = resolveAttachment(a);
      return [r.name, r.mimeType, r.size, r.url];
    }),
    blocks: toRefRows(task.blocks),
    blockedBy: toRefRows(task.blockedBy),
    relatesTo: toRefRows(task.relatesTo),
    duplicates: toRefRows(task.duplicates),
  };
}
