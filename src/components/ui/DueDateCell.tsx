import { DatePicker } from 'antd';
import {
  WarningOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useRef } from 'react';
import type { DueDateCellType } from './ui.types';

export function DueDateCell({
  dueDate,
  onChange,
  isCompleted = false,
}: DueDateCellType) {
  const value = dueDate ? dayjs(dueDate) : null;

  const containerRef = useRef<HTMLDivElement | null>(null);

  const today = dayjs().startOf('day');

  const isToday = value?.isSame(today, 'day');
  const isTomorrow = value?.isSame(today.add(1, 'day'), 'day');
  const isOverdue = value ? value.isBefore(today, 'day') : false;
  const showOverdueState = isOverdue && !isCompleted;

  const renderIcon = () => {
    if (showOverdueState) {
      return <WarningOutlined style={{ color: '#ef4444' }} />;
    }
    if (isToday || isTomorrow) {
      return <ClockCircleOutlined style={{ color: '#f59e0b' }} />;
    }
    return <CalendarOutlined style={{ color: '#9ca3af' }} />;
  };

  let label = 'None';
  let color = 'text-gray-500';

  if (isOverdue) {
    const overdueDays = value ? today.diff(value, 'day') : 0;
    label =
      overdueDays <= 1
        ? 'Yesterday'
        : `${overdueDays} day${overdueDays > 1 ? 's' : ''} ago`;
  }

  if (showOverdueState) {
    color = 'text-red-500';
  } else if (isToday) {
    label = 'Today';
    color = 'text-yellow-500';
  } else if (isTomorrow) {
    label = 'Tomorrow';
    color = 'text-yellow-500';
  } else if (value) {
    label = value.format('DD-MM-YYYY');
  }

  return (
    <div className="flex items-center gap-1 text-xs">
      <div
        onClick={() => {
          const input = containerRef.current?.querySelector('input');
          input?.click();
        }}
        className="flex cursor-pointer items-center gap-1 rounded px-1 py-0.5 hover:bg-gray-100 dark:hover:bg-slate-700"
      >
        {renderIcon()}
        <span className={`${color} whitespace-nowrap`}>{label}</span>
      </div>

      <div ref={containerRef} className="absolute h-0 w-0 overflow-hidden">
        <DatePicker
          value={value}
          suffixIcon={null}
          format="DD-MM-YYYY"
          onChange={(date) => onChange(date ? dayjs(date).toISOString() : '')}
          status={showOverdueState ? 'error' : undefined}
        />
      </div>
    </div>
  );
}
