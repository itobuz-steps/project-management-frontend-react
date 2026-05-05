import type { ParsedPreview, PreviewTask } from '../importTypes';

export const ALLOWED_IMPORT_HEADERS = [
  'title',
  'description',
  'type',
  'status',
  'priority',
  'tags',
  'duedate',
  'assignee',
] as const;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_PRIORITIES = new Set(['low', 'medium', 'high', 'critical']);
const MONTH_NAME_TO_INDEX: Record<string, number> = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dec: 11,
};

function normalizeHeader(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[\s_\-.]+/g, '');
}

function toCanonicalHeader(normalizedHeader: string): string {
  if (normalizedHeader === 'summary' || normalizedHeader === 'sumary') {
    return 'title';
  }

  return normalizedHeader;
}

function splitCsvRecords(text: string): string[] {
  const records: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];

    if (char === '"') {
      // Preserve escaped quotes within quoted fields.
      if (inQuotes && text[i + 1] === '"') {
        current += '""';
        i += 1;
        continue;
      }

      inQuotes = !inQuotes;
      current += char;
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && text[i + 1] === '\n') {
        i += 1;
      }
      records.push(current);
      current = '';
      continue;
    }

    current += char;
  }

  if (current || text.endsWith('\n') || text.endsWith('\r')) {
    records.push(current);
  }

  return records;
}

function splitCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
        continue;
      }

      inQuotes = !inQuotes;
      continue;
    }

    if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
      continue;
    }

    current += char;
  }

  values.push(current);
  return values;
}

function unquoteCsv(value: string): string {
  return value.trim().replace(/^"|"$/g, '').replace(/""/g, '"');
}

function escapeCsv(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function normalizePriority(value: string): string {
  const raw = value.trim().toLowerCase();
  if (!raw) {
    return '';
  }

  return VALID_PRIORITIES.has(raw) ? raw : '';
}

function normalizeDueDateToIso(value: string): string {
  const raw = value.trim();
  if (!raw) {
    return '';
  }

  // Jira exports often use formats like: 10/Apr/26 4:23 PM
  const jiraDateTime = raw.match(
    /^\s*(\d{1,2})\/([A-Za-z]{3})\/(\d{2,4})(?:\s+.*)?$/
  );
  if (jiraDateTime) {
    const day = Number(jiraDateTime[1]);
    const monthToken = jiraDateTime[2].toLowerCase();
    const yearToken = jiraDateTime[3];
    const month = MONTH_NAME_TO_INDEX[monthToken];
    const year =
      yearToken.length === 2 ? 2000 + Number(yearToken) : Number(yearToken);

    if (month !== undefined) {
      const utc = new Date(Date.UTC(year, month, day));
      if (
        utc.getUTCFullYear() === year &&
        utc.getUTCMonth() === month &&
        utc.getUTCDate() === day
      ) {
        return utc.toISOString();
      }
    }
    return '';
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    const [year, month, day] = raw.split('-').map(Number);
    const utc = new Date(Date.UTC(year, month - 1, day));
    if (
      utc.getUTCFullYear() === year &&
      utc.getUTCMonth() === month - 1 &&
      utc.getUTCDate() === day
    ) {
      return utc.toISOString();
    }
    return '';
  }

  if (/^\d{4}-\d{2}-\d{2}T/i.test(raw)) {
    const dateOnly = raw.slice(0, 10);
    const [year, month, day] = dateOnly.split('-').map(Number);
    const utc = new Date(Date.UTC(year, month - 1, day));
    if (
      utc.getUTCFullYear() === year &&
      utc.getUTCMonth() === month - 1 &&
      utc.getUTCDate() === day
    ) {
      return utc.toISOString();
    }
    return '';
  }

  const slashOrDash = raw.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (slashOrDash) {
    const partA = Number(slashOrDash[1]);
    const partB = Number(slashOrDash[2]);
    const year = Number(slashOrDash[3]);

    const day = partA > 12 ? partA : partB > 12 ? partB : partA;
    const month = partA > 12 ? partB : partB > 12 ? partA : partB;

    const utc = new Date(Date.UTC(year, month - 1, day));
    if (
      utc.getUTCFullYear() === year &&
      utc.getUTCMonth() === month - 1 &&
      utc.getUTCDate() === day
    ) {
      return utc.toISOString();
    }
    return '';
  }

  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? '' : parsed.toISOString();
}

function normalizeAssigneeEmail(value: string): string {
  const raw = value.trim();
  if (!raw) {
    return '';
  }

  return EMAIL_REGEX.test(raw) ? raw : '';
}

export function sanitizeCsvForImport(text: string): {
  csvText: string;
  droppedHeaders: string[];
  cleanupWarnings: string[];
} {
  const trimmed = text.trim();
  if (!trimmed) {
    return { csvText: '', droppedHeaders: [], cleanupWarnings: [] };
  }

  const lines = splitCsvRecords(trimmed);
  if (lines.length === 0) {
    return { csvText: '', droppedHeaders: [], cleanupWarnings: [] };
  }

  const rawHeaders = splitCsvLine(lines[0]).map(unquoteCsv);
  const normalizedHeaders = rawHeaders.map((header) =>
    toCanonicalHeader(normalizeHeader(header))
  );

  const allowedSet = new Set<string>(ALLOWED_IMPORT_HEADERS);
  const keptHeaders = ALLOWED_IMPORT_HEADERS.filter((header) =>
    normalizedHeaders.includes(header)
  );

  const keptIndexes = keptHeaders
    .map((header) => normalizedHeaders.indexOf(header))
    .filter((idx) => idx >= 0);

  const droppedHeaders = rawHeaders.filter(
    (_, idx) => !allowedSet.has(normalizedHeaders[idx])
  );

  let clearedInvalidAssignees = 0;
  let normalizedDueDates = 0;
  let clearedInvalidDueDates = 0;
  let normalizedPriorities = 0;
  let clearedInvalidPriorities = 0;

  const outLines: string[] = [keptHeaders.join(',')];

  for (const line of lines.slice(1)) {
    if (!line.trim()) {
      continue;
    }

    const cleanedValues = splitCsvLine(line).map(unquoteCsv);
    const filtered = keptHeaders.map((header, colIdx) => {
      const idx = keptIndexes[colIdx];
      const value = cleanedValues[idx] ?? '';

      if (header === 'assignee') {
        const normalized = normalizeAssigneeEmail(value);
        if (value.trim() && !normalized) {
          clearedInvalidAssignees += 1;
        }
        return normalized;
      }

      if (header === 'duedate') {
        const normalized = normalizeDueDateToIso(value);
        if (value.trim()) {
          if (!normalized) {
            clearedInvalidDueDates += 1;
          } else if (normalized !== value.trim()) {
            normalizedDueDates += 1;
          }
        }
        return normalized;
      }

      if (header === 'priority') {
        const normalized = normalizePriority(value);
        if (value.trim()) {
          if (!normalized) {
            clearedInvalidPriorities += 1;
          } else if (normalized !== value.trim().toLowerCase()) {
            normalizedPriorities += 1;
          }
        }
        return normalized;
      }

      return value;
    });
    outLines.push(filtered.map(escapeCsv).join(','));
  }

  const cleanupWarnings: string[] = [];
  if (clearedInvalidAssignees > 0) {
    cleanupWarnings.push(
      `Cleared invalid assignee email on ${clearedInvalidAssignees} row${clearedInvalidAssignees !== 1 ? 's' : ''}.`
    );
  }
  if (normalizedDueDates > 0) {
    cleanupWarnings.push(
      `Converted dueDate to ISO 8601 on ${normalizedDueDates} row${normalizedDueDates !== 1 ? 's' : ''}.`
    );
  }
  if (clearedInvalidDueDates > 0) {
    cleanupWarnings.push(
      `Cleared invalid dueDate on ${clearedInvalidDueDates} row${clearedInvalidDueDates !== 1 ? 's' : ''}.`
    );
  }
  if (normalizedPriorities > 0) {
    cleanupWarnings.push(
      `Normalized priority values on ${normalizedPriorities} row${normalizedPriorities !== 1 ? 's' : ''}.`
    );
  }
  if (clearedInvalidPriorities > 0) {
    cleanupWarnings.push(
      `Cleared invalid priority on ${clearedInvalidPriorities} row${clearedInvalidPriorities !== 1 ? 's' : ''}.`
    );
  }

  return {
    csvText: outLines.join('\n'),
    droppedHeaders,
    cleanupWarnings,
  };
}

export default function parseCsvPreview(text: string): ParsedPreview {
  const lines = splitCsvRecords(text.trim());
  if (lines.length < 2) {
    return {
      tasks: [],
      clientErrors: ['CSV must have a header row and at least one data row.'],
      total: 0,
    };
  }

  const rawHeaders = splitCsvLine(lines[0]).map(unquoteCsv);
  const normalizedHeaders = rawHeaders.map((header) =>
    toCanonicalHeader(normalizeHeader(header))
  );

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
    const cleaned = splitCsvLine(line).map(unquoteCsv);

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
