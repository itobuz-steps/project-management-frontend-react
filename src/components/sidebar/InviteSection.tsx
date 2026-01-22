import { Mail } from 'lucide-react';
import type { Props } from '../../types/sidebar.types';

export default function InviteSection({ collapsed }: Props) {
  return (
    <li>
      <div
        id="toggleInviteForm"
        className="group hover:bg-primary-200 flex cursor-pointer items-center gap-4 rounded-lg bg-gray-50 p-2 shadow"
      >
        <Mail size={25} />
        {!collapsed && (
          <p className="group-hover:text-primary-900 text-lg">Invite</p>
        )}
      </div>

      <form id="inviteForm" className="mt-2 hidden w-full rounded-md p-4">
        <label className="mb-2 block text-sm font-semibold text-gray-600">
          User Email
        </label>
        <input
          type="email"
          className="mb-3 w-full rounded border p-2"
          placeholder="Enter email"
        />
        <button className="bg-primary-500 w-full rounded py-2 text-white">
          Send Invite
        </button>
      </form>
    </li>
  );
}
