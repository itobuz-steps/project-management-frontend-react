const STATUS_CONFIG: Record<
  string,
  { label: string; dot: string; pill: string }
> = {
  Done: {
    label: 'Done',
    dot: 'bg-[#1F845A]',
    pill: 'bg-[#DCFFF1] text-[#1F845A]',
  },
  'In Progress': {
    label: 'In Progress',
    dot: 'bg-[#0C66E4]',
    pill: 'bg-[#E9F2FF] text-[#0C66E4]',
  },
  'To Do': {
    label: 'To Do',
    dot: 'bg-[#44546F]',
    pill: 'bg-[#F1F2F4] text-[#44546F]',
  },
  'In Review': {
    label: 'In Review',
    dot: 'bg-[#8270DB]',
    pill: 'bg-[#F0EBFF] text-[#8270DB]',
  },
  Blocked: {
    label: 'Blocked',
    dot: 'bg-[#E2483D]',
    pill: 'bg-[#FFEDEB] text-[#E2483D]',
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
