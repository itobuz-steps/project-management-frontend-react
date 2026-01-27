import { Empty } from "antd";
import type { Task } from "../../types/tasks.types";

export function SubtasksTab({ task }: { task: Task }) {
  if (!task.subTask?.length) return <Empty />;

  return (
    <div className="space-y-2">
      {task.subTask.map((sub) => (
        <div
          key={sub._id}
          className="flex flex-col gap-1 rounded border p-2 sm:flex-row sm:items-center sm:justify-between"
        >
          <span className="break-all">{sub.title}</span>
        </div>
      ))}
    </div>
  );
}
