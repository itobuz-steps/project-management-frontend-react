import { UsergroupAddOutlined } from '@ant-design/icons';

interface InviteUserButtonProps {
  onClick: () => void;
}

export function InviteUserButton({ onClick }: InviteUserButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center rounded-md p-1 text-gray-900 transition-colors hover:bg-gray-200 dark:text-neutral-100 dark:hover:bg-neutral-800"
    >
      <UsergroupAddOutlined style={{ fontSize: '1.5rem' }} />
    </button>
  );
}
