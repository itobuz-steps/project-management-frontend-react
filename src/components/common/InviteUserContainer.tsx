import { message, Modal } from 'antd';
import { useState } from 'react';
import { sendInvite } from '../../services/inviteService';
import { useProject } from '../../context/ProjectContext';
import { InviteUserForm } from './InviteUserForm';
import { InviteUserButton } from './InviteUserButton';
import { Can } from '../../utils/PermissionHoc';

interface InviteUserContainerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function InviteUserContainer({
  open: externalOpen,
  onOpenChange,
}: InviteUserContainerProps = {}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = externalOpen !== undefined;
  const formOpen = isControlled ? externalOpen! : internalOpen;
  const setFormOpen = (value: boolean) => {
    if (isControlled) {
      onOpenChange?.(value);
    } else {
      setInternalOpen(value);
    }
  };
  const { project } = useProject();

  async function handleFinish(values: { email: string | string[] }) {
    if (!project) {
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const rawEmail = values.email;
    const emailString = Array.isArray(rawEmail)
      ? rawEmail.join(',')
      : rawEmail || '';

    const emails = emailString
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
      <>
        {!isControlled && (
          <InviteUserButton onClick={() => setFormOpen(true)} />
        )}

        <Modal
          title="Invite users"
          open={formOpen}
          onCancel={() => setFormOpen(false)}
          footer={null}
          destroyOnClose
          maskStyle={{
            backdropFilter: 'none',
            backgroundColor: 'rgba(0,0,0,0.45)',
          }}
        >
          <InviteUserForm
            submitHandler={handleFinish}
            onCancel={() => setFormOpen(false)}
          />
        </Modal>
      </>
    </Can>
  );
}
