import { Select } from 'antd';
import type { Sprint } from '../../../services/types/sprints.types';

interface SprintSelectorProps {
  sprints: Sprint[];
  selectedSprintId: string | null;
  onSelect: (sprintId: string) => void;
}

export function SprintSelector({
  sprints,
  selectedSprintId,
  onSelect,
}: SprintSelectorProps) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-semibold text-gray-600">
        Completed Sprint:
      </label>
      <Select
        value={selectedSprintId}
        onChange={onSelect}
        style={{ width: 260 }}
        options={sprints.map((s) => ({
          label: s.name || s.key,
          value: s._id,
        }))}
      />
    </div>
  );
}
