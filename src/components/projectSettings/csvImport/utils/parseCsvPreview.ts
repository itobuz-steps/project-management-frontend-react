import type { ParsedPreview, PreviewTask } from '../importTypes';
import {
  buildRowFromHeaders,
  getDataLines,
  getNormalizedHeaders,
  parseCsvValues,
  splitCsvRecords,
} from './csvParsing';

export default function parseCsvPreview(text: string): ParsedPreview {
  const lines = splitCsvRecords(text.trim());
  if (lines.length < 2) {
    return {
      tasks: [],
      clientErrors: ['CSV must have a header row and at least one data row.'],
      total: 0,
    };
  }

  const { normalizedHeaders } = getNormalizedHeaders(lines[0]);

  if (!normalizedHeaders.includes('title')) {
    return {
      tasks: [],
      clientErrors: [
        'Missing required column: "title". Please check your CSV headers.',
      ],
      total: 0,
    };
  }

  const tasks: PreviewTask[] = [];
  const clientErrors: string[] = [];
  const dataLines = getDataLines(lines);

  for (const [i, line] of dataLines.entries()) {
    const row = buildRowFromHeaders(normalizedHeaders, parseCsvValues(line));

    if (!row['title']) {
      clientErrors.push(
        `Row ${i + 2}: Missing title — will be skipped by server.`
      );
      continue;
    }

    tasks.push({
      title: row['title'],
      type: row['type'] || undefined,
      priority: row['priority'] || undefined,
    });
  }

  return { tasks, clientErrors, total: dataLines.length };
}
