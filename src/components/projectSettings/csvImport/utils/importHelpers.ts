import type { ParsedPreview, PreviewTask } from '../importTypes';

function normalizeHeader(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[\s_\-.]+/g, '');
}

export default function parseCsvPreview(text: string): ParsedPreview {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) {
    return {
      tasks: [],
      clientErrors: ['CSV must have a header row and at least one data row.'],
      total: 0,
    };
  }

  const rawHeaders = lines[0]
    .split(',')
    .map((h) => h.trim().replace(/^"|"$/g, ''));
  const normalizedHeaders = rawHeaders.map(normalizeHeader);

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
  const dataLines = lines.slice(1).filter((l) => l.trim());

  for (const [i, line] of dataLines.entries()) {
    const values = line.match(/(".*?"|[^,]+)(?=,|$)/g) ?? line.split(',');
    const cleaned = values.map((v) => v.trim().replace(/^"|"$/g, ''));

    const row: Record<string, string> = {};
    normalizedHeaders.forEach((h, idx) => {
      row[h] = cleaned[idx] ?? '';
    });

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
