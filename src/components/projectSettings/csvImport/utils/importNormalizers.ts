import {
  EMAIL_REGEX,
  MONTH_NAME_TO_INDEX,
  VALID_PRIORITIES,
} from './importConstants';

function toIsoIfValidDate(
  year: number,
  monthIndex: number,
  day: number
): string {
  const utc = new Date(Date.UTC(year, monthIndex, day));
  const isValid =
    utc.getUTCFullYear() === year &&
    utc.getUTCMonth() === monthIndex &&
    utc.getUTCDate() === day;

  return isValid ? utc.toISOString() : '';
}

export function normalizePriority(value: string): string {
  const raw = value.trim().toLowerCase();
  return raw && VALID_PRIORITIES.has(raw) ? raw : '';
}

export function normalizeDueDateToIso(value: string): string {
  const raw = value.trim();
  if (!raw) {
    return '';
  }

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

    return month === undefined ? '' : toIsoIfValidDate(year, month, day);
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    const [year, month, day] = raw.split('-').map(Number);
    return toIsoIfValidDate(year, month - 1, day);
  }

  if (/^\d{4}-\d{2}-\d{2}T/i.test(raw)) {
    const dateOnly = raw.slice(0, 10);
    const [year, month, day] = dateOnly.split('-').map(Number);
    return toIsoIfValidDate(year, month - 1, day);
  }

  const slashOrDash = raw.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (slashOrDash) {
    const partA = Number(slashOrDash[1]);
    const partB = Number(slashOrDash[2]);
    const year = Number(slashOrDash[3]);

    const day = partA > 12 ? partA : partB > 12 ? partB : partA;
    const month = partA > 12 ? partB : partB > 12 ? partA : partB;

    return toIsoIfValidDate(year, month - 1, day);
  }

  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? '' : parsed.toISOString();
}

export function normalizeAssigneeEmail(value: string): string {
  const raw = value.trim();
  return raw && EMAIL_REGEX.test(raw) ? raw : '';
}
