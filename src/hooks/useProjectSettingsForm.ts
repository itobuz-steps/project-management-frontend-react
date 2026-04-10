import { useState } from 'react';
import { message, type FormInstance } from 'antd';
import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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
  const queryClient = useQueryClient();

  const [selectedUser, setSelectedUser] = useState<string>();
  const [selectedRole, setSelectedRole] = useState<ProjectMemberRole>('member');

  const [projectMembers, setProjectMembers] = useState<EditableProjectMember[]>(
    () => project.members ?? []
  );

  const [visibleMembers, setVisibleMembers] = useState<EditableProjectMember[]>(
    []
  );

  const [currentProjectId, setCurrentProjectId] = useState(project._id);

  if (currentProjectId !== project._id) {
    setCurrentProjectId(project._id);
    setProjectMembers(project.members ?? []);
    setVisibleMembers([]);
  }

  const updateProjectMutation = useMutation({
    mutationFn: ({
      projectId,
      formData,
    }: {
      projectId: string;
      formData: FormData;
    }) => updateProject(projectId, formData),

    onSuccess: (updated) => {
      setProject(updated);

      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({
        queryKey: ['project', project._id],
      });

      message.success('Project updated successfully');
    },

    onError: (error) => {
      if (error instanceof AxiosError) {
        message.error(
          error.response?.data?.message || error.message || 'Update failed'
        );
      } else {
        message.error('Something went wrong');
      }
    },
  });

  const handleSubmit = (
    values: ProjectSettingsFormValues,
    form: FormInstance
  ) => {
    const formData = new FormData();

    const removeList = values.removeMembers ?? [];

    const filteredMembers = projectMembers.filter(
      (member) =>
        !(removeList.includes(member.user) && member.role === 'member')
    );

    formData.append('name', values.name);
    formData.append('projectType', values.projectType);
    formData.append('memberLead', values.memberLead);
    formData.append('defaultAssignee', values.defaultAssignee ?? 'null');

    if (values.prefix) {
      formData.append('prefix', values.prefix);
    }

    filteredMembers.forEach((member, index) => {
      formData.append(`members[${index}][user]`, member.user);
      formData.append(`members[${index}][role]`, member.role);
    });

    if (iconFile) {
      formData.append('icon', iconFile);
    }

    formData.append('theme', theme);

    updateProjectMutation.mutate(
      { projectId: project._id, formData },
      {
        onSuccess: (updated) => {
          form.resetFields(['removeMembers']);
          setIconFile(null);
          setIconPreview(updated.icon ?? null);
        },
      }
    );
  };

  const addMemberRole = () => {
    if (!selectedUser) {
      return;
    }

    const exists = projectMembers.find(
      (member) => member.user === selectedUser
    );

    if (exists?.role === selectedRole) {
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

    setVisibleMembers((prev) => {
      const visibleExists = prev.find((member) => member.user === selectedUser);

      if (!visibleExists) {
        return [...prev, { user: selectedUser, role: selectedRole }];
      }

      return prev.map((member) =>
        member.user === selectedUser
          ? { ...member, role: selectedRole }
          : member
      );
    });

    setSelectedUser(undefined);
    setSelectedRole('member');
  };

  const changeMemberRole = (userId: string, role: ProjectMemberRole) => {
    setProjectMembers((prev) =>
      prev.map((member) =>
        member.user === userId ? { ...member, role } : member
      )
    );

    setVisibleMembers((prev) =>
      prev.map((member) =>
        member.user === userId ? { ...member, role } : member
      )
    );
  };

  // Add this new function inside useProjectSettingsForm, after changeMemberRole

  const changeMemberRoleAndSave = async (
    userId: string,
    role: ProjectMemberRole
  ) => {
    // 1. Compute the updated members list before setState (which is async)
    const updatedMembers = projectMembers.map((member) =>
      member.user === userId ? { ...member, role } : member
    );

    // 2. Update local state optimistically
    setProjectMembers(updatedMembers);
    setVisibleMembers((prev) =>
      prev.map((member) =>
        member.user === userId ? { ...member, role } : member
      )
    );

    // 3. Build FormData with the updated members and existing project values
    const formData = new FormData();

    formData.append('name', project.name);
    formData.append('projectType', project.projectType);
    formData.append('memberLead', project.memberLead);
    formData.append('defaultAssignee', project.defaultAssignee ?? 'null');

    if (project.prefix) {
      formData.append('prefix', project.prefix);
    }

    updatedMembers.forEach((member, index) => {
      formData.append(`members[${index}][user]`, member.user);
      formData.append(`members[${index}][role]`, member.role);
    });

    formData.append('theme', theme);

    // 4. Fire the mutation
    updateProjectMutation.mutate({ projectId: project._id, formData });
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
    loading: updateProjectMutation.isPending,
    projectMembers,
    visibleMembers,
    selectedUser,
    selectedRole,
    setSelectedUser,
    setSelectedRole,
    handleSubmit,
    addMemberRole,
    changeMemberRole,
    changeMemberRoleAndSave,
    removeMember,
  };
}
