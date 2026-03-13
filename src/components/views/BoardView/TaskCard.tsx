import { useState } from 'react';
import type { TaskPopulated } from '../../../services/types/tasks.types';
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
}: {
  task: TaskPopulated;
  column: string;
  compactMode: boolean;
  onOpen: () => void;
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
      className={`group rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md ${
        isDragging ? 'opacity-50' : ''
      }`}
      onClick={() => onOpen()}
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
