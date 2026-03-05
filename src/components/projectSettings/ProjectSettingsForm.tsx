import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Upload,
  Tag,
  Row,
  Col,
  message,
} from 'antd';
import { UploadOutlined, CloseOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { updateProject } from '../../services/projectService';
import type { Project } from '../../types/project.types';
import { UserCell } from '../../components/ui/UserCell';
import type { ProjectSettingsFormProps } from './projectSettings.type';

function ProjectSettingsForm({
  project,
  members,
  setProject,
}: ProjectSettingsFormProps) {
  const [form] = Form.useForm<Project>();
  const [loading, setLoading] = useState(false);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [, setIconPreview] = useState<string | null>(null);

  useEffect(() => {
    form.setFieldsValue({
      name: project.name,
      prefix: project.prefix,
      projectType: project.projectType,
      defaultAssignee: project.defaultAssignee ?? '',
    });

    setIconPreview(project.icon ?? null);
  }, [project, form]);

  const handleSubmit = async (values: Project) => {
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append('name', values.name);
      formData.append('prefix', values.prefix);
      formData.append('projectType', values.projectType);

      if (values.defaultAssignee) {
        formData.append('defaultAssignee', values.defaultAssignee);
      }

      if (iconFile) {
        formData.append('icon', iconFile);
      }

      const updated = await updateProject(project._id, formData);

      setProject(updated);

      setIconFile(null);
      setIconPreview(updated.icon ?? null);

      message.success('✨ Project updated successfully');
    } catch {
      message.error('Update failed');
    } finally {
      setLoading(false);
    }
  };

  const spaceOwner = members.find(
    (member) => member._id === project.memberLead
  );

  return (
    <Card style={{ borderRadius: 16 }}>
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Project Name"
              name="name"
              rules={[{ required: true }]}
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item label="Category" name="projectType">
              <Select
                size="large"
                options={[
                  { label: 'Kanban', value: 'kanban' },
                  { label: 'Scrum', value: 'scrum' },
                ]}
              />
            </Form.Item>

            <Form.Item label="Space Owner">
              <div className="flex items-center rounded-lg border border-gray-300 bg-gray-50 px-3 py-1">
                <UserCell user={spaceOwner} emptyText="Unknown" />{' '}
              </div>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item label="Project Key" name="prefix">
              <Input size="large" style={{ textTransform: 'uppercase' }} />
            </Form.Item>

            <Form.Item label="Default Assignee" name="defaultAssignee">
              <Select
                allowClear
                placeholder="Unassigned"
                size="large"
                options={[
                  {
                    value: '',
                    label: <UserCell user={undefined} emptyText="Unassigned" />,
                  },
                  ...members.map((member) => ({
                    value: member._id,
                    label: <UserCell user={member} emptyText="Unassigned" />,
                  })),
                ]}
              />
            </Form.Item>

            <Form.Item label="Project Icon">
              <Upload
                beforeUpload={(file) => {
                  setIconFile(file);
                  setIconPreview(URL.createObjectURL(file));
                  return false;
                }}
                showUploadList={false}
              >
                <Button icon={<UploadOutlined />}>Change Icon</Button>
              </Upload>

              {iconFile && (
                <div
                  style={{
                    marginTop: 10,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    flexWrap: 'wrap',
                    maxWidth: '100%',
                  }}
                >
                  <Tag
                    color="blue"
                    style={{
                      maxWidth: '85%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {iconFile.name}
                  </Tag>

                  <Button
                    type="text"
                    icon={<CloseOutlined />}
                    onClick={() => {
                      setIconFile(null);
                      setIconPreview(project.icon ?? null);
                    }}
                  />
                </div>
              )}
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button
            htmlType="submit"
            loading={loading}
            size="large"
            style={{
              borderRadius: 8,
              background: 'var(--color-primary-500)',
              borderColor: 'var(--color-primary-500)',
              color: '#fff',
            }}
          >
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}

export default ProjectSettingsForm;
