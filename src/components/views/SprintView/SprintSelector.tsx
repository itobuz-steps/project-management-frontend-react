import { Select } from 'antd';
import type { SprintSelectorProps } from './sprintView.types';

export function SprintSelector({
  sprints,
  selectedSprintId,
  onSelect,
}: SprintSelectorProps) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-semibold text-gray-600 dark:text-white">
        Completed Sprint:
      </label>
      <Select
        value={selectedSprintId}
        onChange={onSelect}
        style={{ width: 260 }}
        options={sprints.map((sprint) => ({
          label: sprint.name || sprint.key,
          value: sprint._id,
        }))}
      />
    </div>
  );
}
