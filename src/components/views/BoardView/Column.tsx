import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import ColumnDropZone from './ColumnDropZone';
import { TaskCard } from './TaskCard';
import type { TaskPopulated } from '../../../services/types/tasks.types';
import { Can } from '../../../utils/PermissionHoc';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

interface ColumnProps {
  col: string;
  tasks: TaskPopulated[];
  loading: boolean;
  error: string | null;
  onAdd: (col: string) => void;
  onDelete: (col: string) => void;
  onTaskOpen: (taskId: string) => void;
}

export function Column({
  col,
  tasks,
  loading,
  error,
  onAdd,
  onDelete,
  onTaskOpen,
}: ColumnProps) {
  return (
    <div key={col} className="group w-72 shrink-0">
      <div className="h-full rounded-lg bg-[#f8f8f8] shadow-sm">
        <div className="sticky top-0 z-10 flex items-center justify-between gap-2 px-4 py-2">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-gray-600 uppercase">
              {col}
            </h2>
            <span className="rounded-full bg-gray-300 px-2 py-0.5 text-xs font-semibold text-gray-900">
              {tasks?.length ?? 0}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Can permission="ADD_COLUMN">
              <button
                type="button"
                aria-label="Add column"
                className="pointer-events-none rounded p-1 text-gray-500 opacity-0 transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100 hover:bg-gray-200 hover:text-gray-700 focus:opacity-100"
                onClick={() => onAdd(col)}
              >
                <PlusOutlined />
              </button>
            </Can>
            <Can permission="DELETE_COLUMN">
              <button
                type="button"
                aria-label="Delete column"
                className="pointer-events-none rounded p-1 text-gray-500 opacity-0 transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 focus:opacity-100"
                onClick={() => onDelete(col)}
              >
                <DeleteOutlined />
              </button>
            </Can>
          </div>
        </div>

        <ColumnDropZone id={col}>
          <SortableContext
            items={(tasks ?? []).map((task) => task._id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-3 p-3">
              {loading && (
                <div className="rounded-md border border-dashed border-gray-200 bg-gray-50 p-3 text-sm text-gray-500">
                  Loading tasks...
                </div>
              )}

              {error && (
                <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {!loading && !error && tasks?.length === 0 && (
                <div className="rounded-md border border-dashed border-gray-200 bg-gray-50 p-3 text-sm text-gray-500">
                  No tasks
                </div>
              )}

              {!loading &&
                !error &&
                tasks?.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    column={col}
                    onOpen={() => onTaskOpen(task._id)}
                  />
                ))}
            </div>
          </SortableContext>
        </ColumnDropZone>
      </div>
    </div>
  );
}

export default Column;
