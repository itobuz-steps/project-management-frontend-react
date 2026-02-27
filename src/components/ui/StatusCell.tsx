import { useTaskUpdate } from "../../hooks/useTaskUpdate";
import type { StatusCellProps } from "../linkedItems/linkedItems.types";
import { StatusSelect } from "./StatusSelect";

export function StatusCell({ row, projectColumns, onStatusChange }: StatusCellProps) {
  const { update } = useTaskUpdate(row.item._id, (updatedTask) => {
    onStatusChange({
      ...row.item,
      status: updatedTask.status,
    });
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