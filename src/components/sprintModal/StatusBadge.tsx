const STATUS_CONFIG: Record<
  string,
  { label: string; dot: string; pill: string }
> = {
  Done: {
    label: 'Done',
    dot: 'bg-[#1F845A]',
    pill: 'bg-[#DCFFF1] text-[#1F845A] dark:bg-emerald-950/60 dark:text-emerald-300',
  },
  'In Progress': {
    label: 'In Progress',
    dot: 'bg-[#0C66E4]',
    pill: 'bg-[#E9F2FF] text-[#0C66E4] dark:bg-blue-950/60 dark:text-blue-300',
  },
  'To Do': {
    label: 'To Do',
    dot: 'bg-[#44546F] dark:bg-neutral-400',
    pill: 'bg-[#F1F2F4] text-[#44546F] dark:bg-neutral-700 dark:text-neutral-100',
  },
  'In Review': {
    label: 'In Review',
    dot: 'bg-[#8270DB]',
    pill: 'bg-[#F0EBFF] text-[#8270DB] dark:bg-violet-950/60 dark:text-violet-300',
  },
  Blocked: {
    label: 'Blocked',
    dot: 'bg-[#E2483D]',
    pill: 'bg-[#FFEDEB] text-[#E2483D] dark:bg-red-950/60 dark:text-red-300',
  },
};

const StatusBadge = ({ status }: { status: string }) => {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG['To Do'];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide ${cfg.pill}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

export default StatusBadge;
