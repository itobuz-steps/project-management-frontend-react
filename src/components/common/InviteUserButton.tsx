import { UserPlus } from 'lucide-react';

interface InviteUserButtonProps {
  onClick: () => void;
}

export function InviteUserButton({ onClick }: InviteUserButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-md text-slate-700 transition-colors hover:bg-slate-200 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:outline-none dark:text-slate-200 dark:hover:bg-[#2a2a33] dark:hover:text-white dark:focus-visible:ring-slate-600"
    >
      <UserPlus size={16} strokeWidth={1.9} />
    </button>
  );
}
