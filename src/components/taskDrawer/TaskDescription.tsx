import type { TaskPopulated } from "../../services/types/tasks.types";

export function TaskDescription({ task }: { task: TaskPopulated }) {
  return (
    <div className="mb-6">
      <h4 className="mb-2 text-sm font-semibold text-gray-600">Description</h4>

      <div className="rounded-md border bg-gray-50 p-3 text-sm">
        {task.description || (
          <span className="text-gray-400">Add a description…</span>
        )}
      </div>
    </div>
  );
}