import {
  Card,
  Form,
  Input,
  Select,
  Avatar,
  Button,
  message,
  Upload,
  Tag,
  Typography,
  Row,
  Col,
  Popconfirm,
} from 'antd';
import {
  UserOutlined,
  UploadOutlined,
  DeleteOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { useProject } from '../context/ProjectContext';
import { getProjectMembers, updateProject } from '../services/projectService';
import { useEffect, useState } from 'react';
import type { User } from '../services/types/tasks.types';
import { UserCell } from '../components/ui/UserCell';
import { deleteProject } from '../services/projectService';
import { useNavigate } from 'react-router-dom';
import type { ProjectType } from '../types/project.types';

const { Title, Text } = Typography;

type ProjectSettingsForm = {
  name: string;
  prefix: string;
  projectType: ProjectType;
  defaultAssignee?: string;
};

function ProjectSettings() {
  const { project, setProject } = useProject();
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [form] = Form.useForm<ProjectSettingsForm>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!project?._id) return;

    const fetchMembers = async () => {
      try {
        const res = await getProjectMembers(project._id);
        setMembers(res);
      } catch {
        message.error('Failed to fetch members');
      }
    };

    fetchMembers();
  }, [project?._id]);

  // 🔥 keep form synced with project
  useEffect(() => {
    if (!project) return;

    form.setFieldsValue({
      name: project.name,
      prefix: project.prefix,
      projectType: project.projectType,
    });

    setIconPreview(project.icon ?? null);
  }, [project, form]);

  if (!project) return null;

  const handleSubmit = async (values: ProjectSettingsForm) => {
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

  const handleDeleteProject = async () => {
    if (!project?._id) return;

    try {
      setLoading(true);

      await deleteProject(project._id);

      message.success('Project deleted successfully');

      navigate('/project/undefined');
    } catch {
      message.error('Failed to delete project');
    } finally {
      setLoading(false);
    }
  };

  const spaceOwner = members.find(
    (member) => member._id === project.memberLead
  );

  return (
    <div style={{ padding: 10, maxWidth: 800, margin: 'auto' }}>
      {/* HEADER */}
      <div
        style={{
          background: 'var(--color-primary-100)',
          borderRadius: 16,
          padding: 24,
          marginBottom: 4,
        }}
      >
        <Row align="middle" gutter={20}>
          <Col>
            <Avatar
              size={80}
              src={iconPreview ?? undefined}
              icon={!iconPreview && <UserOutlined />}
            >
              {!iconPreview && project.name?.[0]}
            </Avatar>
          </Col>

          <Col>
            <Title level={3} style={{ margin: 0 }}>
              {project.name}
            </Title>

            <Text>Project Key: {project.prefix}</Text>

            <br />

            <Tag color="gold" style={{ marginTop: 8 }}>
              {project.projectType?.toUpperCase()}
            </Tag>
          </Col>
        </Row>
      </div>

      {/* SETTINGS CARD */}
      <Card style={{ borderRadius: 16 }}>
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          <Row gutter={24}>
            {/* LEFT */}
            <Col xs={24} md={12}>
              <Form.Item
                label="Project Name"
                name="name"
                rules={[{ required: true }]}
              >
                <Input size="large" />
              </Form.Item>

              <Form.Item
                label="Category"
                name="projectType"
                rules={[{ required: true }]}
              >
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
                  <UserCell user={spaceOwner} emptyText="Unknown" />
                </div>
              </Form.Item>
            </Col>

            {/* RIGHT */}
            <Col xs={24} md={12}>
              <Form.Item
                label="Project Key"
                name="prefix"
                rules={[
                  { required: true, message: 'Project key is required' },
                  { max: 10 },
                ]}
              >
                <Input size="large" style={{ textTransform: 'uppercase' }} />
              </Form.Item>

              <Form.Item label="Default Assignee" name="defaultAssignee">
                <Select
                  allowClear
                  placeholder="Unassigned"
                  size="large"
                  optionLabelProp="label"
                  options={[
                    {
                      value: '',
                      label: (
                        <UserCell user={undefined} emptyText="Unassigned" />
                      ),
                    },
                    ...members.map((member) => ({
                      value: member._id,
                      label: <UserCell user={member} emptyText="Unassigned" />,
                    })),
                  ]}
                />
              </Form.Item>

              {/* ICON UPLOAD */}
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
                        maxWidth: '100%',
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

      {/* DANGER ZONE */}
      <Card
        style={{
          marginTop: 32,
          borderRadius: 16,
          border: '1px solid #ffccc7',
        }}
      >
        <Title level={5} style={{ color: '#cf1322' }}>
          Delete Project
        </Title>

        <Text type="danger">
          Deleting this project will permanently remove all tasks and sprints.
        </Text>

        <br />

        <Popconfirm
          title="Delete this project?"
          description="This action cannot be undone."
          okText="Delete"
          cancelText="Cancel"
          okButtonProps={{ danger: true }}
          onConfirm={handleDeleteProject}
        >
          <Button danger icon={<DeleteOutlined />} style={{ marginTop: 16 }}>
            Delete Project
          </Button>
        </Popconfirm>
      </Card>
    </div>
  );
}

export default ProjectSettings;
