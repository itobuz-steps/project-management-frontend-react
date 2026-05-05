import { ALLOWED_IMPORT_HEADERS } from './importConstants';
import {
  escapeCsv,
  getDataLines,
  getNormalizedHeaders,
  parseCsvValues,
  pushCleanupWarning,
  splitCsvRecords,
} from './csvParsing';
import {
  normalizeAssigneeEmail,
  normalizeDueDateToIso,
  normalizePriority,
} from './importNormalizers';

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
  const { rawHeaders, normalizedHeaders } = getNormalizedHeaders(lines[0]);

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

  for (const line of getDataLines(lines)) {
    const cleanedValues = parseCsvValues(line);
    const filtered = keptHeaders.map((header, colIdx) => {
      const idx = keptIndexes[colIdx];
      const value = cleanedValues[idx] ?? '';
      const trimmedValue = value.trim();

      if (header === 'assignee') {
        const normalized = normalizeAssigneeEmail(value);
        if (trimmedValue && !normalized) {
          clearedInvalidAssignees += 1;
        }
        return normalized;
      }

      if (header === 'duedate') {
        const normalized = normalizeDueDateToIso(value);
        if (trimmedValue) {
          if (!normalized) {
            clearedInvalidDueDates += 1;
          } else if (normalized !== trimmedValue) {
            normalizedDueDates += 1;
          }
        }
        return normalized;
      }

      if (header === 'priority') {
        const normalized = normalizePriority(value);
        if (trimmedValue) {
          if (!normalized) {
            clearedInvalidPriorities += 1;
          } else if (normalized !== trimmedValue.toLowerCase()) {
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
  pushCleanupWarning(
    cleanupWarnings,
    clearedInvalidAssignees,
    'Cleared invalid assignee email'
  );
  pushCleanupWarning(
    cleanupWarnings,
    normalizedDueDates,
    'Converted dueDate to ISO 8601'
  );
  pushCleanupWarning(
    cleanupWarnings,
    clearedInvalidDueDates,
    'Cleared invalid dueDate'
  );
  pushCleanupWarning(
    cleanupWarnings,
    normalizedPriorities,
    'Normalized priority values'
  );
  pushCleanupWarning(
    cleanupWarnings,
    clearedInvalidPriorities,
    'Cleared invalid priority'
  );

  return {
    csvText: outLines.join('\n'),
    droppedHeaders,
    cleanupWarnings,
  };
}
