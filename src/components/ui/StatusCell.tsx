import { useTaskUpdate } from '../../hooks/useTaskUpdate';
import type { StatusCellProps } from '../linkedItems/linkedItems.types';
import { StatusSelect } from './StatusSelect';

export function StatusCell({
  row,
  projectColumns,
  onStatusChange,
}: StatusCellProps) {
  // Pass the full updated task back to parent so it can fully reconcile state
  const { update } = useTaskUpdate(row.item._id, (updatedTask) => {
    onStatusChange(updatedTask);
  });

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <StatusSelect
        value={row.item.status}
        columns={projectColumns}
        onChange={(status) => update({ status }, 'Failed to update status')}
      />
    </div>
  );
}
