import jsPDF from 'jspdf';
import { buildSections } from '../sections';
import {
  BLUE,
  sectionHeader,
  kvTable,
  dataTable,
  maybeNewPage,
} from '../pdf-helpers';
import type { TaskPopulated } from '../../../services/types/tasks.types';

export function exportTaskPDF(task: TaskPopulated, fileName: string): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
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

  const section = (
    label: string,
    renderFn: (startY: number) => number,
    needed = 35
  ) => {
    y = maybeNewPage(doc, y, needed);
    y = sectionHeader(doc, label, y);
    y = renderFn(y);
    y += 9;
  };

  section('Core Details', (sy) => kvTable(doc, sec.core, sy), 40);
  section('People', (sy) => kvTable(doc, sec.people, sy), 40);
  section('Dates', (sy) => kvTable(doc, sec.dates, sy), 30);
  section(`Subtasks (${sec.subTasks.length})`, (sy) =>
    dataTable(doc, ['Task ID'], sec.subTasks, sy)
  );
  section(`Attachments (${sec.attachments.length})`, (sy) =>
    dataTable(doc, ['Filename', 'Type', 'Size', 'URL'], sec.attachments, sy)
  );

  const refHead = ['ID', 'Key', 'Title', 'Status', 'Type'];
  section(`Blocks (${sec.blocks.length})`, (sy) =>
    dataTable(doc, refHead, sec.blocks, sy)
  );
  section(`Blocked By (${sec.blockedBy.length})`, (sy) =>
    dataTable(doc, refHead, sec.blockedBy, sy)
  );
  section(`Relates To (${sec.relatesTo.length})`, (sy) =>
    dataTable(doc, refHead, sec.relatesTo, sy)
  );
  section(`Duplicates (${sec.duplicates.length})`, (sy) =>
    dataTable(doc, refHead, sec.duplicates, sy)
  );

  // Page numbers
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(160, 160, 160);
    doc.text(`Page ${i} of ${pages}`, 196, 290, { align: 'right' });
  }

  doc.save(`${fileName}.pdf`);
}
