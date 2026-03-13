import { useState } from 'react';
import type { TaskPopulated, User } from '../../../services/types/tasks.types';
import { useSortable } from '@dnd-kit/sortable';
import { DeleteTaskModal } from '../../../utils/DeleteTaskModal';
import { CSS } from '@dnd-kit/utilities';
import { useProject } from '../../../context/ProjectContext';
import { CompactTaskCard } from './CompactTaskCard';
import { ExpandedTaskCard } from './ExpandedTaskCard';

export function TaskCard({
  task,
  column,
  compactMode,
  onOpen,
  onUpdated,
  members,
  loadingMembers,
}: {
  task: TaskPopulated;
  column: string;
  compactMode: boolean;
  onOpen: () => void;
  onUpdated: (task: TaskPopulated) => void;
  members: User[];
  loadingMembers: boolean;
}) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { columns } = useProject();

  const isCompleted = column === columns[columns.length - 1];

  const priorityLabel =
    task.priority?.charAt(0).toUpperCase() + task.priority?.slice(1);

  const linksCount =
    (task.blocks?.length ?? 0) +
    (task.blockedBy?.length ?? 0) +
    (task.relatesTo?.length ?? 0) +
    (task.duplicates?.length ?? 0);

  const subtasksTotal = task.subTasks?.length ?? 0;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task._id, data: { type: 'task', column } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`task-card group rounded-xl border border-gray-200 bg-white px-4 py-2 shadow-sm transition-all hover:shadow-md ${
        isDragging ? 'opacity-50' : ''
      }`}
      onClick={(e) => {
        const target = e.target as HTMLElement;

        if (target.closest('button') || target.closest('.ant-select')) {
          return;
        }

        onOpen();
      }}
      {...attributes}
      {...listeners}
    >
      {compactMode ? (
        <CompactTaskCard
          task={task}
          isCompleted={isCompleted}
          linksCount={linksCount}
          subtasksTotal={subtasksTotal}
          priorityLabel={priorityLabel}
          onUpdated={onUpdated}
          members={members}
          loadingMembers={loadingMembers}
          onDeleteClick={(event) => {
            event.stopPropagation();
            setIsDeleteOpen(true);
          }}
        />
      ) : (
        <ExpandedTaskCard
          task={task}
          isCompleted={isCompleted}
          linksCount={linksCount}
          subtasksTotal={subtasksTotal}
          priorityLabel={priorityLabel}
          onUpdated={onUpdated}
          members={members}
          loadingMembers={loadingMembers}
          onDeleteClick={(event) => {
            event.stopPropagation();
            setIsDeleteOpen(true);
          }}
        />
      )}

      <DeleteTaskModal
        task={task}
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onDeleted={() => setIsDeleteOpen(false)}
      />
    </div>
  );
}
