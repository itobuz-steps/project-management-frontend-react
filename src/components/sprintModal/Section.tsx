import { useState } from 'react';
import TaskCard from './TaskCard';
import type { TaskPopulated } from '../../services/types/tasks.types';

interface SectionProps {
  title: string;
  count: number;
  accentColor: string;
  emptyText: string;
  tasks: TaskPopulated[];
  defaultOpen?: boolean;
}

const Section = ({
  title,
  count,
  accentColor,
  emptyText,
  tasks,
  defaultOpen = true,
}: SectionProps) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="overflow-hidden rounded-md border border-[#DCDFE4] dark:border-neutral-700">
      {/* Section header */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between bg-[#F7F8F9] px-4 py-2.5 text-left transition-colors hover:bg-[#F1F2F4] dark:bg-neutral-800 dark:hover:bg-neutral-700"
      >
        <div className="flex items-center gap-2.5">
          {/* Colored left indicator */}
          <span
            className="h-3 w-1 rounded-full"
            style={{ backgroundColor: accentColor }}
          />
          <span className="text-sm font-semibold text-[#172B4D] dark:text-white">
            {title}
          </span>
          <span className="rounded-full bg-[#DFE1E6] px-2 py-0.5 text-xs font-bold text-[#44546F] dark:bg-neutral-700 dark:text-neutral-200">
            {count}
          </span>
        </div>
        {/* Chevron */}
        <svg
          className={`h-4 w-4 text-[#626F86] transition-transform duration-200 dark:text-neutral-300 ${open ? 'rotate-0' : '-rotate-90'}`}
          viewBox="0 0 16 16"
          fill="currentColor"
        >
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </button>

      {/* Body */}
      {open && (
        <div className="space-y-1.5 bg-[#FAFBFC] p-3 dark:bg-neutral-900">
          {tasks.length === 0 ? (
            <p className="py-2 text-center text-xs text-[#8993A4] dark:text-neutral-400">
              {emptyText}
            </p>
          ) : (
            tasks.map((task) => <TaskCard key={task._id} task={task} />)
          )}
        </div>
      )}
    </div>
  );
};

export default Section;
