import type { FilterValue } from 'antd/es/table/interface';
import dayjs from 'dayjs';
import { taskTableColumns } from '../../../config/constants';

export const DEFAULT_STATUSES = ['todo', 'in-progress', 'done'];

export const formatDate = (value?: string) =>
  value ? dayjs(value).format('DD-MM-YYYY') : '-';

const unique = (values: string[]) => [...new Set(values.filter(Boolean))];

export const toFilters = (values: string[]) =>
  unique(values).map((value) => ({ text: value, value }));

export const asSingleFilter = (value?: FilterValue | null): string | null => {
  if (!Array.isArray(value) || !value.length || value[0] == null) {
    return null;
  }
  return String(value[0]);
};

export const asMultiFilter = (value?: FilterValue | null): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.map((item) => String(item)).filter(Boolean);
};

export const TYPE_FILTERS = toFilters(['bug', 'story', 'task']);

const columnClassMap: Record<string, string> = {};
taskTableColumns.forEach(({ label, className }) => {
  columnClassMap[label] = className;
});

export const headerClass = (label: string) =>
  `bg-gray-100 text-[11px] leading-[1.2] font-semibold text-gray-600 uppercase ${columnClassMap[label] ?? ''}`;

export const bodyClass = (label: string, extra = '') => {
  const base = columnClassMap[label] ?? '';
  return extra ? `${base} ${extra}` : base;
};

export const toSelectFilterOptions = (
  options: { text: string; value: string }[],
  valueMap: Record<string, string>
) =>
  options.map((option) => ({
    text: option.text,
    value: valueMap[option.value] ?? option.value,
  }));

export const buildMemberFilterMap = (
  members: { _id: string; name: string }[],
  fallbackLabel: string,
  fallbackValue: string
) => {
  const filters = toFilters([...members.map((m) => m.name), fallbackLabel]);
  const valueMap: Record<string, string> = { [fallbackLabel]: fallbackValue };
  members.forEach((m) => {
    valueMap[m.name] = m._id;
  });
  return { filters, valueMap };
};
