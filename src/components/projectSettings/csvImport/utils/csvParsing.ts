function normalizeHeader(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[\s_\-.]+/g, '');
}

function toCanonicalHeader(normalizedHeader: string): string {
  return normalizedHeader === 'summary' || normalizedHeader === 'sumary'
    ? 'title'
    : normalizedHeader;
}

export function splitCsvRecords(text: string): string[] {
  const records: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];

    if (char === '"') {
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

export function escapeCsv(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function parseCsvValues(line: string): string[] {
  return splitCsvLine(line).map(unquoteCsv);
}

export function getNormalizedHeaders(headerLine: string): {
  rawHeaders: string[];
  normalizedHeaders: string[];
} {
  const rawHeaders = parseCsvValues(headerLine);
  const normalizedHeaders = rawHeaders.map((header) =>
    toCanonicalHeader(normalizeHeader(header))
  );

  return { rawHeaders, normalizedHeaders };
}

export function getDataLines(lines: string[]): string[] {
  return lines.slice(1).filter((line) => line.trim());
}

export function buildRowFromHeaders(
  headers: string[],
  values: string[]
): Record<string, string> {
  const row: Record<string, string> = {};
  headers.forEach((header, idx) => {
    row[header] = values[idx] ?? '';
  });
  return row;
}

export function formatRowCount(count: number): string {
  return `${count} row${count !== 1 ? 's' : ''}`;
}

export function pushCleanupWarning(
  warnings: string[],
  count: number,
  label: string
): void {
  if (count > 0) {
    warnings.push(`${label} on ${formatRowCount(count)}.`);
  }
}
