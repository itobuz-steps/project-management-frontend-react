import * as XLSX from 'xlsx';
import { buildSections } from '../sections';
import type { TaskPopulated } from '../../../services/types/tasks.types';

const mkSheet = (rows: unknown[][], colWidths: number[]) => {
  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws['!cols'] = colWidths.map((w) => ({ wch: w }));
  return ws;
};

export function exportTaskExcel(task: TaskPopulated, fileName: string): void {
  const sec = buildSections(task);
  const wb = XLSX.utils.book_new();

  const refHead = ['ID', 'Key', 'Title', 'Status', 'Type'];
  const refWidths = [28, 14, 55, 14, 12];

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

  XLSX.utils.book_append_sheet(
    wb,
    mkSheet([['Subtask ID'], ...sec.subTasks], [36]),
    'Subtasks'
  );

  XLSX.utils.book_append_sheet(
    wb,
    mkSheet(
      [['Filename', 'MIME Type', 'Size', 'URL'], ...sec.attachments],
      [32, 22, 10, 60]
    ),
    'Attachments'
  );

  const appendRef = (name: string, rows: string[][]) =>
    XLSX.utils.book_append_sheet(
      wb,
      mkSheet([refHead, ...rows], refWidths),
      name
    );

  appendRef('Blocks', sec.blocks);
  appendRef('Blocked By', sec.blockedBy);
  appendRef('Relates To', sec.relatesTo);
  appendRef('Duplicates', sec.duplicates);

  XLSX.writeFile(wb, `${fileName}.xlsx`);
}
