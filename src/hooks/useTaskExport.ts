import { useCallback } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import type {
  BackendAttachment,
  TaskPopulated,
} from '../services/types/tasks.types';

interface JsPDFWithAutoTable extends jsPDF {
  lastAutoTable: { finalY: number };
}

const resolveName = (u?: { name?: string; email?: string } | null): string => {
  if (!u) return '—';
  return (
    [u.name, u.email ? `<${u.email}>` : ''].filter(Boolean).join(' ') || '—'
  );
};

const resolveEmail = (u?: { email?: string } | null): string => u?.email ?? '—';

const resolveProjectId = (p: TaskPopulated['projectId']): string => {
  if (typeof p === 'string') return p;
  return p._id ?? p.name ?? '—';
};

const resolveProjectName = (p: TaskPopulated['projectId']): string => {
  if (typeof p === 'string') return p;
  return p.name ?? p._id ?? '—';
};

const fmt = (d?: string | null): string => {
  if (!d) return '—';
  return new Date(d).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const fmtSize = (bytes?: number): string => {
  if (bytes == null) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
};

interface ResolvedAttachment {
  name: string;
  mimeType: string;
  size: string;
  url: string;
}

const resolveAttachment = (
  a: File | string | BackendAttachment
): ResolvedAttachment => {
  if (typeof a === 'string')
    return { name: '—', mimeType: '—', size: '—', url: a };
  if (a instanceof File)
    return { name: a.name, mimeType: a.type, size: fmtSize(a.size), url: '—' };
  // BackendAttachment
  return {
    name: a.name,
    mimeType: a.mimeType,
    size: fmtSize(a.size),
    url: a.url,
  };
};

const xmlEsc = (v: string): string =>
  v
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const str = (v: string | number | undefined | null): string =>
  v != null && v !== '' ? String(v) : '—';

const xe = (v: string | number | undefined | null): string =>
  xmlEsc(v != null && v !== '' ? String(v) : '');

function buildSections(task: TaskPopulated) {
  const core: [string, string][] = [
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
    ['Project Name', resolveProjectName(task.projectId)],
  ];

  const people: [string, string][] = [
    ['Assignee', resolveName(task.assignee)],
    ['Assignee Email', resolveEmail(task.assignee)],
    ['Reporter', resolveName(task.reporter)],
    ['Reporter Email', resolveEmail(task.reporter)],
  ];

  const dates: [string, string][] = [
    ['Created At', fmt(task.createdAt)],
    ['Updated At', fmt(task.updatedAt)],
  ];

  const subTasks = (task.subTasks ?? []).map((id) => [id]);

  const attachments = (task.attachments ?? []).map((a) => {
    const r = resolveAttachment(a);
    return [r.name, r.mimeType, r.size, r.url];
  });

  const toRefRows = (refs?: TaskPopulated['blocks']) =>
    (refs ?? []).map((r) => [r._id, r.key ?? '—', r.title, r.status, r.type]);

  return {
    core,
    people,
    dates,
    subTasks,
    attachments,
    blocks: toRefRows(task.blocks),
    blockedBy: toRefRows(task.blockedBy),
    relatesTo: toRefRows(task.relatesTo),
    duplicates: toRefRows(task.duplicates),
  };
}

type RGB = [number, number, number];
const BLUE: RGB = [59, 130, 246];
const SLATE: RGB = [71, 85, 105];
const DARK: RGB = [15, 23, 42];

function sectionHeader(doc: jsPDF, label: string, y: number): number {
  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...BLUE);
  doc.text(label.toUpperCase(), 14, y);
  doc.setDrawColor(...BLUE);
  doc.setLineWidth(0.25);
  doc.line(14, y + 1.5, 196, y + 1.5);
  return y + 7;
}

function kvTable(doc: jsPDF, rows: [string, string][], startY: number): number {
  autoTable(doc, {
    startY,
    body: rows,
    theme: 'plain',
    columnStyles: {
      0: {
        cellWidth: 42,
        fontStyle: 'bold',
        textColor: SLATE,
        fillColor: [248, 250, 252],
      },
      1: { cellWidth: 'auto', textColor: DARK },
    },
    styles: {
      fontSize: 9.5,
      cellPadding: { top: 2.5, bottom: 2.5, left: 4, right: 4 },
      overflow: 'linebreak',
    },
    alternateRowStyles: { fillColor: [241, 245, 249] },
    margin: { left: 14, right: 14 },
  });
  return (doc as JsPDFWithAutoTable).lastAutoTable?.finalY ?? startY;
}

function dataTable(
  doc: jsPDF,
  head: string[],
  body: string[][],
  startY: number
): number {
  if (!body.length) {
    doc.setFontSize(9);
    doc.setTextColor(160, 160, 160);
    doc.text('None recorded.', 18, startY + 5);
    return startY + 12;
  }
  autoTable(doc, {
    startY,
    head: [head],
    body,
    theme: 'striped',
    headStyles: {
      fillColor: BLUE,
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 8.5,
    },
    bodyStyles: { fontSize: 8.5, textColor: DARK },
    styles: {
      cellPadding: { top: 2, bottom: 2, left: 3, right: 3 },
      overflow: 'linebreak',
    },
    margin: { left: 14, right: 14 },
  });
  return (doc as JsPDFWithAutoTable).lastAutoTable?.finalY ?? startY;
}

function maybeNewPage(doc: jsPDF, y: number, needed = 35): number {
  if (y + needed > 276) {
    doc.addPage();
    return 20;
  }
  return y;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useTaskExport(task: TaskPopulated) {
  const fileName =
    (task.title ?? 'task')
      .replace(/[^a-z0-9_\-\s]/gi, '')
      .trim()
      .replace(/\s+/g, '_')
      .slice(0, 50) || 'task';

  // ── PDF ────────────────────────────────────────────────────────────────────

  const exportPDF = useCallback(() => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    const sec = buildSections(task);

    // Banner
    doc.setFillColor(...BLUE);
    doc.rect(0, 0, 210, 28, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(task.title, 14, 16);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `Key: ${task.key ?? '—'}  ·  Status: ${task.status}  ·  Priority: ${task.priority}  ·  Exported: ${new Date().toLocaleString()}`,
      14,
      24
    );

    let y = 36;

    y = sectionHeader(doc, 'Core Details', y);
    y = kvTable(doc, sec.core, y);
    y += 7;

    y = maybeNewPage(doc, y, 40);
    y = sectionHeader(doc, 'People', y);
    y = kvTable(doc, sec.people, y);
    y += 7;

    y = maybeNewPage(doc, y, 30);
    y = sectionHeader(doc, 'Dates', y);
    y = kvTable(doc, sec.dates, y);
    y += 9;

    y = maybeNewPage(doc, y, 35);
    y = sectionHeader(doc, `Subtasks (${sec.subTasks.length})`, y);
    y = dataTable(doc, ['Task ID'], sec.subTasks, y);
    y += 9;

    y = maybeNewPage(doc, y, 35);
    y = sectionHeader(doc, `Attachments (${sec.attachments.length})`, y);
    y = dataTable(doc, ['Filename', 'Type', 'Size', 'URL'], sec.attachments, y);
    y += 9;

    y = maybeNewPage(doc, y, 35);
    y = sectionHeader(doc, `Blocks (${sec.blocks.length})`, y);
    y = dataTable(doc, ['ID', 'Key', 'Title', 'Status', 'Type'], sec.blocks, y);
    y += 9;

    y = maybeNewPage(doc, y, 35);
    y = sectionHeader(doc, `Blocked By (${sec.blockedBy.length})`, y);
    y = dataTable(
      doc,
      ['ID', 'Key', 'Title', 'Status', 'Type'],
      sec.blockedBy,
      y
    );
    y += 9;

    y = maybeNewPage(doc, y, 35);
    y = sectionHeader(doc, `Relates To (${sec.relatesTo.length})`, y);
    y = dataTable(
      doc,
      ['ID', 'Key', 'Title', 'Status', 'Type'],
      sec.relatesTo,
      y
    );
    y += 9;

    y = maybeNewPage(doc, y, 35);
    y = sectionHeader(doc, `Duplicates (${sec.duplicates.length})`, y);
    dataTable(doc, ['ID', 'Key', 'Title', 'Status', 'Type'], sec.duplicates, y);

    // Page numbers
    const pages = doc.getNumberOfPages();
    for (let i = 1; i <= pages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(160, 160, 160);
      doc.text(`Page ${i} of ${pages}`, 196, 290, { align: 'right' });
    }

    doc.save(`${fileName}.pdf`);
  }, [task, fileName]);

  // ── Excel ──────────────────────────────────────────────────────────────────

  const exportExcel = useCallback(() => {
    const sec = buildSections(task);
    const wb = XLSX.utils.book_new();

    const mkSheet = (rows: unknown[][], colWidths: number[]) => {
      const ws = XLSX.utils.aoa_to_sheet(rows);
      ws['!cols'] = colWidths.map((w) => ({ wch: w }));
      return ws;
    };

    // Summary
    XLSX.utils.book_append_sheet(
      wb,
      mkSheet(
        [
          ...sec.core,
          ['', ''],
          ['── People ──', ''],
          ...sec.people,
          ['', ''],
          ['── Dates ──', ''],
          ...sec.dates,
        ],
        [22, 120]
      ),
      'Summary'
    );

    // Subtasks
    XLSX.utils.book_append_sheet(
      wb,
      mkSheet([['Subtask ID'], ...sec.subTasks], [36]),
      'Subtasks'
    );

    // Attachments
    XLSX.utils.book_append_sheet(
      wb,
      mkSheet(
        [['Filename', 'MIME Type', 'Size', 'URL'], ...sec.attachments],
        [32, 22, 10, 60]
      ),
      'Attachments'
    );

    // Task references
    const refHead = ['ID', 'Key', 'Title', 'Status', 'Type'];
    const refWidths = [28, 14, 55, 14, 12];

    XLSX.utils.book_append_sheet(
      wb,
      mkSheet([refHead, ...sec.blocks], refWidths),
      'Blocks'
    );
    XLSX.utils.book_append_sheet(
      wb,
      mkSheet([refHead, ...sec.blockedBy], refWidths),
      'Blocked By'
    );
    XLSX.utils.book_append_sheet(
      wb,
      mkSheet([refHead, ...sec.relatesTo], refWidths),
      'Relates To'
    );
    XLSX.utils.book_append_sheet(
      wb,
      mkSheet([refHead, ...sec.duplicates], refWidths),
      'Duplicates'
    );

    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }, [task, fileName]);

  // ── XML ────────────────────────────────────────────────────────────────────

  const exportXML = useCallback(() => {
    const userNode = (
      tag: string,
      u?: { name?: string; email?: string; _id?: string } | null
    ) => {
      if (!u) return `<${tag}/>`;
      return `<${tag}><id>${xe(u._id)}</id><n>${xe(u.name)}</n><email>${xe(u.email)}</email></${tag}>`;
    };

    const refNodes = (tag: string, refs?: TaskPopulated['blocks']) =>
      (refs ?? []).length
        ? `  <${tag} count="${(refs ?? []).length}">
${(refs ?? []).map((r) => `    <item><id>${xe(r._id)}</id><key>${xe(r.key)}</key><title>${xe(r.title)}</title><status>${xe(r.status)}</status><type>${xe(r.type)}</type></item>`).join('\n')}
  </${tag}>`
        : `  <${tag} count="0"/>`;

    const tagsXML = (task.tags ?? [])
      .map((t) => `    <tag>${xmlEsc(t)}</tag>`)
      .join('\n');
    const labelsXML = (task.labels ?? [])
      .map((l) => `    <label>${xmlEsc(l)}</label>`)
      .join('\n');
    const subTasksXML = (task.subTasks ?? [])
      .map((id) => `    <subtask>${xmlEsc(id)}</subtask>`)
      .join('\n');
    const attachXML = (task.attachments ?? [])
      .map((a) => {
        const r = resolveAttachment(a);
        return `    <attachment>
      <name>${xmlEsc(r.name)}</name>
      <mimeType>${xmlEsc(r.mimeType)}</mimeType>
      <size>${xmlEsc(r.size)}</size>
      <url>${xmlEsc(r.url)}</url>
    </attachment>`;
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
  <labels>
${labelsXML}
  </labels>
  <tags>
${tagsXML}
  </tags>

  <!-- People -->
  ${userNode('assignee', task.assignee)}
  ${userNode('reporter', task.reporter)}

  <!-- Dates -->
  <createdAt>${xe(task.createdAt)}</createdAt>
  <updatedAt>${xe(task.updatedAt)}</updatedAt>

  <!-- Subtasks -->
  <subTasks count="${(task.subTasks ?? []).length}">
${subTasksXML}
  </subTasks>

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
  }, [task, fileName]);

  return { exportPDF, exportExcel, exportXML };
}
