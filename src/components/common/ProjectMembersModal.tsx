// react imports not required
import { Modal, Select, Button, Spin, Tooltip } from 'antd';
import type { FormInstance } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { Crown } from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { useProjectMetaData } from '../../hooks/useProjectMetaData';
import { Can } from '../../utils/PermissionHoc';
import { useProjectSettingsForm } from '../../hooks/useProjectSettingsForm';
import { UserCell } from '../ui/UserCell';
import type { User } from '../../services/types/tasks.types';
import type { Project } from '../../types/project.types';
import type { ProjectSettingsFormValues } from '../../components/projectSettings/projectSettings.type';

interface ProjectMembersModalProps {
  open: boolean;
  onClose: () => void;
}

export function ProjectMembersModal({
  open,
  onClose,
}: ProjectMembersModalProps) {
  const { project, setProject } = useProject();
  const { members, loadingMembers } = useProjectMetaData(project?._id);

  const setProjectStrict = (p: Project) => setProject(p);

  const {
    loading,
    projectMembers,
    changeMemberRole,
    removeMember,
    handleSubmit,
  } = useProjectSettingsForm({
    project: (project as Project) ?? ({} as Project),
    members: (members as User[]) ?? [],
    setProject: setProjectStrict,
    iconFile: null,
    setIconFile: () => {},
    setIconPreview: () => {},
    theme: project?.theme ?? '',
  });

  const handleSave = async () => {
    if (!project) {
      return;
    }

    const values: ProjectSettingsFormValues = {
      name: project.name,
      prefix: project.prefix ?? null,
      projectType: project.projectType,
      defaultAssignee: project.defaultAssignee ?? null,
      memberLead: project.memberLead,
      theme: project.theme,
      removeMembers: [],
    };

    const dummyForm = { resetFields: () => {} } as unknown as FormInstance;

    await handleSubmit(values, dummyForm);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Modal
        wrapClassName="project-members-modal"
        title={
          <div className="flex items-center gap-2">
            <span>Project Members</span>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-normal text-gray-500 dark:bg-slate-700 dark:text-slate-300">
              {projectMembers.length}
            </span>
          </div>
        }
        open={open}
        onCancel={handleCancel}
        maskStyle={{
          backdropFilter: 'none',
          backgroundColor: 'rgba(0,0,0,0.45)',
        }}
        width={480}
        footer={
          <div className="flex justify-end gap-2">
            <Button onClick={handleCancel}>Close</Button>
            <Can permission="PROJECT_SETTINGS">
              <Button
                type="primary"
                loading={loading}
                onClick={handleSave}
                style={{
                  background: 'var(--color-primary-500)',
                  borderColor: 'var(--color-primary-500)',
                }}
              >
                Save Changes
              </Button>
            </Can>
          </div>
        }
      >
        {loadingMembers ? (
          <div className="flex justify-center py-10">
            <Spin />
          </div>
        ) : projectMembers.length === 0 ? (
          <p className="py-6 text-center text-sm text-gray-400 dark:text-slate-400">
            No members found.
          </p>
        ) : (
          <div className="flex max-h-105 flex-col gap-2 overflow-y-auto py-1 pr-1">
            {projectMembers.map((localMember) => {
              const user = members.find(
                (user) => user._id === localMember.user
              );
              const isProjectLead = project?.memberLead === localMember.user;

              return (
                <div
                  key={localMember.user}
                  className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800"
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
                        onChange={(newRole) =>
                          changeMemberRole(localMember.user, newRole)
                        }
                        options={[
                          { label: 'Admin', value: 'admin' },
                          { label: 'Member', value: 'member' },
                        ]}
                        style={{ width: 90 }}
                        disabled={isProjectLead}
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
