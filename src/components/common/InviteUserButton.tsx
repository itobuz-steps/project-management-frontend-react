import { Tooltip } from 'antd';
import { Plus } from 'lucide-react';

interface InviteUserButtonProps {
  onClick: () => void;
}

export function InviteUserButton({ onClick }: InviteUserButtonProps) {
  return (
    <Tooltip title="Invite members">
      <button
        onClick={onClick}
        className="hover:border-primary-500 hover:text-primary-600 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-dashed border-slate-300 text-slate-500 transition dark:border-slate-600 dark:text-slate-400"
      >
        <Plus size={16} />
      </button>
    </Tooltip>
  );
}
