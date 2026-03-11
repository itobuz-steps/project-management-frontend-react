import { UsergroupAddOutlined } from '@ant-design/icons';

interface InviteUserButtonProps {
  onClick: () => void;
}

export function InviteUserButton({ onClick }: InviteUserButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center text-gray-900"
    >
      <UsergroupAddOutlined style={{ fontSize: '1.5rem' }} />
    </button>
  );
}
