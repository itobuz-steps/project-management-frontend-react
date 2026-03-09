import { useState, useEffect } from 'react';
import { message, type FormInstance } from 'antd';
import { updateProject } from '../services/projectService';
import type {
  EditableProjectMember,
  ProjectSettingsFormValues,
  ProjectSettingsFormProps,
} from '../components/projectSettings/projectSettings.type';
import type { ProjectMemberRole } from '../types/project.types';

export function useProjectSettingsForm({
  project,
  setProject,
  iconFile,
  setIconFile,
  setIconPreview,
  theme,
}: ProjectSettingsFormProps) {
  const [loading, setLoading] = useState(false);

  const [projectMembers, setProjectMembers] = useState<EditableProjectMember[]>(
    project.members || []
  );

  const [visibleMembers, setVisibleMembers] = useState<EditableProjectMember[]>(
    []
  );

  const [selectedUser, setSelectedUser] = useState<string>();
  const [selectedRole, setSelectedRole] = useState<ProjectMemberRole>('member');

  useEffect(() => {
    setProjectMembers(project.members || []);
    setVisibleMembers([]);
  }, [project]);

  const handleSubmit = async (
    values: ProjectSettingsFormValues,
    form: FormInstance
  ) => {
    try {
      setLoading(true);

      const formData = new FormData();

      const removeList = values.removeMembers ?? [];

      const filteredMembers = projectMembers.filter(
        (member) =>
          !(removeList.includes(member.user) && member.role === 'member')
      );

      formData.append('name', values.name);

      if (values.prefix) {
        formData.append('prefix', values.prefix);
      }

      formData.append('projectType', values.projectType);

      formData.append('memberLead', values.memberLead);

      formData.append('defaultAssignee', values.defaultAssignee ?? 'null');

      filteredMembers.forEach((member, index) => {
        formData.append(`members[${index}][user]`, member.user);
        formData.append(`members[${index}][role]`, member.role);
      });

      if (iconFile) {
        formData.append('icon', iconFile);
      }

      formData.append('theme', theme);

      const updated = await updateProject(project._id, formData);

      setProject(updated);

      form.resetFields(['removeMembers']);
      setIconFile(null);
      setIconPreview(updated.icon ?? null);

      message.success('Project updated successfully');
    } catch {
      message.error('Update failed');
    } finally {
      setLoading(false);
    }
  };

  const addMemberRole = () => {
    if (!selectedUser) {
      return;
    }

    const exists = projectMembers.find(
      (member) => member.user === selectedUser
    );

    if (exists && exists.role === selectedRole) {
      message.warning('Member already has this role');
      return;
    }

    if (exists) {
      setProjectMembers((prev) =>
        prev.map((member) =>
          member.user === selectedUser
            ? { ...member, role: selectedRole }
            : member
        )
      );
    } else {
      setProjectMembers((prev) => [
        ...prev,
        { user: selectedUser, role: selectedRole },
      ]);
    }

    const visibleExists = visibleMembers.find(
      (member) => member.user === selectedUser
    );

    if (!visibleExists) {
      setVisibleMembers((prev) => [
        ...prev,
        { user: selectedUser, role: selectedRole },
      ]);
    } else {
      setVisibleMembers((prev) =>
        prev.map((member) =>
          member.user === selectedUser
            ? { ...member, role: selectedRole }
            : member
        )
      );
    }

    setSelectedUser(undefined);
    setSelectedRole('member');
  };

  const removeMember = (userId: string) => {
    setProjectMembers((prev) =>
      prev.filter((member) => member.user !== userId)
    );
    setVisibleMembers((prev) =>
      prev.filter((member) => member.user !== userId)
    );
  };

  return {
    loading,
    projectMembers,
    visibleMembers,
    selectedUser,
    selectedRole,
    setSelectedUser,
    setSelectedRole,
    handleSubmit,
    addMemberRole,
    removeMember,
  };
}
