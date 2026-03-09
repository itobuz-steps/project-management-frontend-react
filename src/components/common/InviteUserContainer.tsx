import { message } from 'antd';
import { useState } from 'react';
import { sendInvite } from '../../services/inviteService';
import { useProject } from '../../context/ProjectContext';
import { InviteUserForm } from './InviteUserForm';
import { InviteUserButton } from './InviteUserButton';
import { X } from 'lucide-react';
import { Can } from '../../utils/PermissionHoc';

export function InviteUserContainer() {
  const [formOpen, setFormOpen] = useState(false);
  const { project } = useProject();

  async function handleFinish(values: { email: string }) {
    if (!project) {
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const emails = values.email
      .split(',')
      .map((email) => email.trim())
      .filter(Boolean);

    const invalidEmails: string[] = [];
    const successEmails: string[] = [];
    const failedEmails: string[] = [];

    for (const email of emails) {
      if (!emailRegex.test(email)) {
        invalidEmails.push(email);
        continue;
      }

      try {
        await sendInvite(email, project._id);
        successEmails.push(email);
      } catch {
        failedEmails.push(email);
      }
    }

    if (successEmails.length) {
      message.success(`Invites sent to: ${successEmails.join(', ')}`);
    }

    if (invalidEmails.length) {
      message.warning(`Invalid emails: ${invalidEmails.join(', ')}`);
    }

    if (failedEmails.length) {
      message.error(`Failed invites: ${failedEmails.join(', ')}`);
    }

    setFormOpen(false);
  }

  return (
    <Can permission="SEND_INVITE">
      {formOpen ? (
        <div className="flex items-center">
          <InviteUserForm submitHandler={handleFinish} />
          <X
            className="-ml-2 cursor-pointer"
            onClick={() => setFormOpen(false)}
          />
        </div>
      ) : (
        <InviteUserButton onClick={() => setFormOpen(true)} />
      )}
    </Can>
  );
}
