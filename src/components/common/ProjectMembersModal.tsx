import { useState } from 'react';
import { Modal, Select, Button, Spin, Tooltip } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { Crown } from 'lucide-react';
import { useProjectMetaData } from '../../hooks/useProjectMetaData';
import { Can } from '../../utils/PermissionHoc';
import { useProjectSettingsForm } from '../../hooks/useProjectSettingsForm';
import { UserCell } from '../ui/UserCell';
import type { Project, ProjectMemberRole } from '../../types/project.types';

interface ProjectMembersModalProps {
  open: boolean;
  onClose: () => void;
  project: Project;
}

export function ProjectMembersModal({
  open,
  onClose,
  project,
}: ProjectMembersModalProps) {
  const projectId = project?._id ?? '';

  const { members, loadingMembers } = useProjectMetaData(projectId);

  const [savingUserId, setSavingUserId] = useState<string | null>(null);

  const { projectMembers, changeMemberRoleAndSave, removeMember } =
    useProjectSettingsForm({
      project: project ?? ({} as Project),
      members: members ?? [],
      setProject: () => {},
      iconFile: null,
      setIconFile: () => {},
      setIconPreview: () => {},
      theme: project?.theme ?? '',
    });

  const handleRoleChange = async (userId: string, newRole: string) => {
    setSavingUserId(userId);
    await changeMemberRoleAndSave(userId, newRole as ProjectMemberRole);
    setSavingUserId(null);
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Modal
        destroyOnClose
        wrapClassName="project-members-modal"
        title={
          <div className="flex items-center gap-2">
            <span>Project Members</span>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-normal text-gray-500 dark:bg-slate-700 dark:text-slate-300">
              {loadingMembers ? '-' : projectMembers?.length || 0}
            </span>
          </div>
        }
        open={open}
        onCancel={onClose}
        maskStyle={{
          backdropFilter: 'none',
          backgroundColor: 'rgba(0,0,0,0.45)',
        }}
        width={480}
        footer={null} // 👈 no footer at all
      >
        {!projectId ? (
          <div className="flex justify-center py-10 text-sm text-gray-400 dark:text-slate-400">
            Invalid project
          </div>
        ) : loadingMembers ? (
          <div className="flex justify-center py-10">
            <Spin />
          </div>
        ) : !projectMembers || projectMembers.length === 0 ? (
          <p className="py-6 text-center text-sm text-gray-400 dark:text-slate-400">
            No members found.
          </p>
        ) : (
          // 👇 minHeight prevents modal from shrinking during loading
          <div
            className="flex max-h-105 flex-col gap-2 overflow-y-auto py-1 pr-1"
            style={{ minHeight: '120px' }}
          >
            {projectMembers.map((localMember) => {
              const user = members?.find(
                (u) => u && String(u._id) === String(localMember.user)
              );

              const isProjectLead =
                String(project?.memberLead) === String(localMember.user);

              const isSaving = savingUserId === localMember.user;

              return (
                // 👇 h-10 locks each row's height so the Select spinner doesn't cause reflow
                <div
                  key={localMember.user}
                  className="flex h-10 items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <UserCell user={user} emptyText="Unknown" />
                    {isProjectLead && (
                      <Tooltip title="Project Lead">
                        <Crown className="h-3.5 w-3.5 shrink-0 text-yellow-500" />
                      </Tooltip>
                    )}
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <Can permission="PROJECT_SETTINGS">
                      <Select
                        size="small"
                        value={localMember.role}
                        loading={isSaving}
                        disabled={isProjectLead || isSaving}
                        onChange={(newRole) =>
                          handleRoleChange(localMember.user, newRole)
                        }
                        options={[
                          { label: 'Admin', value: 'admin' },
                          { label: 'Member', value: 'member' },
                        ]}
                        style={{ width: 90 }}
                      />

                      <Tooltip
                        title={
                          isProjectLead
                            ? 'Cannot remove project lead'
                            : 'Remove member'
                        }
                      >
                        <Button
                          type="text"
                          danger
                          size="small"
                          icon={<DeleteOutlined />}
                          disabled={isProjectLead}
                          onClick={() => removeMember(localMember.user)}
                        />
                      </Tooltip>
                    </Can>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Modal>
    </div>
  );
}
