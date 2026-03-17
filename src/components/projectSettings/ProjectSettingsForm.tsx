import { Card, Form, Input, Select, Button, Row, Col, Tag } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import { UserCell } from '../../components/ui/UserCell';
import { useProjectSettingsForm } from '../../hooks/useProjectSettingsForm';
import type {
  ProjectSettingsFormProps,
  ProjectSettingsFormValues,
} from './projectSettings.type';

function ProjectSettingsForm({
  project,
  members,
  setProject,
  iconFile,
  setIconFile,
  setIconPreview,
  theme,
}: ProjectSettingsFormProps) {
  const [form] = Form.useForm<ProjectSettingsFormValues>();

  const {
    loading,
    visibleMembers,
    selectedUser,
    selectedRole,
    setSelectedUser,
    setSelectedRole,
    handleSubmit,
    addMemberRole,
    removeMember,
    projectMembers,
  } = useProjectSettingsForm({
    project,
    members,
    setProject,
    iconFile,
    setIconFile,
    setIconPreview,
    theme,
  });

  useEffect(() => {
    form.setFieldsValue({
      name: project.name,
      prefix: project.prefix,
      projectType: project.projectType,
      memberLead: project.memberLead,
      defaultAssignee: project.defaultAssignee ?? undefined,
    });
  }, [project, form]);

  return (
    <Card style={{ borderRadius: 10 }}>
      <Form
        layout="vertical"
        form={form}
        onFinish={(values) => handleSubmit(values, form)}
      >
        <Row gutter={24}>
          <Col xs={24} lg={12}>
            <Form.Item
              label="Project Name"
              name="name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Project Key" name="prefix">
                  <Input size="middle" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Category" name="projectType">
                  <Select
                    size="middle"
                    options={[
                      { label: 'Kanban', value: 'kanban' },
                      { label: 'Scrum', value: 'scrum' },
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Project Owner" name="memberLead">
              <Select
                options={projectMembers
                  .filter((member) => member.role === 'admin')
                  .map((member) => {
                    const user = members.find(
                      (user) => user._id === member.user
                    );

                    return {
                      value: member.user,
                      label: <UserCell user={user} emptyText="Unknown" />,
                    };
                  })}
              />
            </Form.Item>
          </Col>

          <Col xs={24} lg={12}>
            <Form.Item label="Default Assignee" name="defaultAssignee">
              <Select
                allowClear
                placeholder="Unassigned"
                options={members.map((member) => ({
                  value: member._id,
                  label: <UserCell user={member} emptyText="Unknown" />,
                }))}
              />
            </Form.Item>

            <Form.Item label="Remove Project Members" name="removeMembers">
              <Select
                mode="multiple"
                allowClear
                placeholder="Select members to remove"
                options={projectMembers
                  .filter((member) => member.role === 'member')
                  .map((member) => {
                    const user = members.find(
                      (user) => user._id === member.user
                    );

                    return {
                      value: member.user,
                      label: <UserCell user={user} emptyText="Unknown" />,
                    };
                  })}
              />
            </Form.Item>

            <Form.Item label="Project Members">
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap gap-2 sm:flex-row sm:flex-nowrap sm:items-center">
                  <Select
                    placeholder="Select Member"
                    className="w-full lg:w-45!"
                    value={selectedUser}
                    onChange={(userId) => {
                      setSelectedUser(userId);

                      const existing = projectMembers.find(
                        (member) => member.user === userId
                      );

                      setSelectedRole(existing ? existing.role : 'member');
                    }}
                    options={members.map((member) => ({
                      value: member._id,
                      label: <UserCell user={member} emptyText="Unknown" />,
                    }))}
                  />

                  <Select
                    className="sm:w-full! w-40! lg:w-20!"
                    size="large"
                    value={selectedRole}
                    onChange={setSelectedRole}
                    options={[
                      { label: 'Admin', value: 'admin' },
                      { label: 'Member', value: 'member' },
                    ]}
                  />

                  <Button
                    style={{
                      background: 'var(--color-primary-500)',
                      padding: '20px 10px',
                    }}
                    type="primary"
                    onClick={addMemberRole}
                  >
                    +
                  </Button>
                </div>

                {visibleMembers.map((member) => {
                  const user = members.find((user) => user._id === member.user);

                  return (
                    <div
                      key={member.user}
                      className="flex items-center justify-between rounded-lg border px-3 py-1"
                    >
                      <UserCell user={user} emptyText="Unknown" />

                      <div className="flex items-center gap-3">
                        {' '}
                        <Tag color="yellow">{member.role}</Tag>{' '}
                        <Button
                          type="text"
                          danger
                          icon={<CloseOutlined />}
                          onClick={() => removeMember(member.user)}
                        />{' '}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              htmlType="submit"
              loading={loading}
              style={{
                background: 'var(--color-primary-500)',
                borderColor: 'var(--color-primary-500)',
                color: '#fff',
              }}
            >
              Update Project Details
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Card>
  );
}

export default ProjectSettingsForm;
