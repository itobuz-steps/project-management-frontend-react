import { message } from 'antd';
import { useState } from 'react';
import { sendInvite } from '../../services/inviteService';
import { useProject } from '../../context/ProjectContext';
import { AxiosError } from 'axios';
import { InviteUserForm } from './InviteUserForm';
import { InviteUserButton } from './InviteUserButton';
import { X } from 'lucide-react';
import { Can } from '../../utils/PermissionHoc';

export function InviteUserContainer() {
  const [formOpen, setFormOpen] = useState(false);
  const { project } = useProject();

  async function handleFinish(values: { email: string }) {
    if (!project) return;
    try {
      await sendInvite(values.email, project._id);
      message.success('Invite sent successfully');
    } catch (error) {
      if (error instanceof AxiosError) {
        message.error(error.response?.data?.message || 'Failed to send invite');
      }
    } finally {
      setFormOpen(false);
    }
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
