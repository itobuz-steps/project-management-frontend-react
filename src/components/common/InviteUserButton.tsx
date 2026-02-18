import { UserPlus } from 'lucide-react';

interface InviteUserButtonProps {
  onClick: () => void;
}

export function InviteUserButton({ onClick }: InviteUserButtonProps) {
  return (
    <button
      onClick={onClick}
      className="border-primary-500 hover:bg-primary-500 text-primary-500 flex items-center gap-2 rounded-sm border-2 px-2 py-1 font-semibold transition-all hover:text-white"
    >
      Invite User
      <UserPlus strokeWidth={'2.5px'} className="size-4" />
    </button>
  );
}
