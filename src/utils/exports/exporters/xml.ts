import type { TaskPopulated } from '../../../services/types/tasks.types';
import {
  xmlEsc,
  xe,
  resolveAttachment,
  resolveProjectId,
  resolveProjectName,
} from '../formatter';

const userNode = (
  tag: string,
  u?: { name?: string; email?: string; _id?: string } | null
) =>
  u
    ? `<${tag}><id>${xe(u._id)}</id><n>${xe(u.name)}</n><email>${xe(u.email)}</email></${tag}>`
    : `<${tag}/>`;

const refNodes = (tag: string, refs?: TaskPopulated['blocks']) =>
  (refs ?? []).length
    ? `  <${tag} count="${(refs ?? []).length}">\n` +
      (refs ?? [])
        .map(
          (r) =>
            `    <item><id>${xe(r._id)}</id><key>${xe(r.key)}</key><title>${xe(r.title)}</title>` +
            `<status>${xe(r.status)}</status><type>${xe(r.type)}</type></item>`
        )
        .join('\n') +
      `\n  </${tag}>`
    : `  <${tag} count="0"/>`;

export function exportTaskXML(task: TaskPopulated, fileName: string): void {
  const listNodes = (tag: string, items: string[], inner: string) =>
    `  <${tag} count="${items.length}">\n` +
    items.map((v) => `    <${inner}>${xmlEsc(v)}</${inner}>`).join('\n') +
    `\n  </${tag}>`;

  const attachXML = (task.attachments ?? [])
    .map((a) => {
      const r = resolveAttachment(a);
      return (
        `    <attachment>\n` +
        `      <name>${xmlEsc(r.name)}</name>\n` +
        `      <mimeType>${xmlEsc(r.mimeType)}</mimeType>\n` +
        `      <size>${xmlEsc(r.size)}</size>\n` +
        `      <url>${xmlEsc(r.url)}</url>\n` +
        `    </attachment>`
      );
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<task>

  <!-- Core -->
  <id>${xe(task._id)}</id>
  <key>${xe(task.key)}</key>
  <title>${xe(task.title)}</title>
  <description>${xe(task.description)}</description>
  <status>${xe(task.status)}</status>
  <priority>${xe(task.priority)}</priority>
  <type>${xe(task.type)}</type>
  <storyPoints>${task.storyPoint ?? ''}</storyPoints>
  <dueDate>${xe(task.dueDate)}</dueDate>
  <parentTask>${xe(task.parentTask)}</parentTask>
  <projectId>${xmlEsc(resolveProjectId(task.projectId))}</projectId>
  <projectName>${xmlEsc(resolveProjectName(task.projectId))}</projectName>

  <!-- Labels & Tags -->
${listNodes('labels', task.labels ?? [], 'label')}
${listNodes('tags', task.tags ?? [], 'tag')}

  <!-- People -->
  ${userNode('assignee', task.assignee)}
  ${userNode('reporter', task.reporter)}

  <!-- Dates -->
  <createdAt>${xe(task.createdAt)}</createdAt>
  <updatedAt>${xe(task.updatedAt)}</updatedAt>

  <!-- Subtasks -->
${listNodes('subTasks', task.subTasks ?? [], 'subtask')}

  <!-- Attachments -->
  <attachments count="${(task.attachments ?? []).length}">
${attachXML}
  </attachments>

  <!-- Relations -->
${refNodes('blocks', task.blocks)}
${refNodes('blockedBy', task.blockedBy)}
${refNodes('relatesTo', task.relatesTo)}
${refNodes('duplicates', task.duplicates)}

  <exportedAt>${new Date().toISOString()}</exportedAt>
</task>`;

  const blob = new Blob([xml], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileName}.xml`;
  a.click();
  URL.revokeObjectURL(url);
}
