import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import type { DueDateCellType } from './ui.types';

export function DueDateCell({ dueDate, onChange }: DueDateCellType) {
  const value = dueDate ? dayjs(dueDate) : null;
  const isOverdue = dueDate && dayjs(dueDate).isBefore(dayjs(), 'day');

  return (
    <DatePicker
      className="w-full max-w-[150px] min-w-[100px]"
      value={value}
      placeholder="None"
      format="DD-MM-YYYY"
      size="small"
      status={isOverdue ? 'error' : undefined}
      onChange={(date) => {
        if (date) {
          onChange(dayjs(date).toISOString());
        }
      }}
    />
  );
}
