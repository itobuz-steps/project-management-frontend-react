import { Card, Typography, Button, Popconfirm, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { deleteProject } from '../../services/projectService';
import { useNavigate } from 'react-router-dom';
import type { ProjectSettingsDeleteProps } from './projectSettings.type';

const { Title, Text } = Typography;

function ProjectDeleteSection({ projectId }: ProjectSettingsDeleteProps) {
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await deleteProject(projectId);

      message.success('Project deleted successfully');

      navigate('/project/undefined');
    } catch {
      message.error('Failed to delete project');
    }
  };

  return (
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
        onConfirm={handleDelete}
      >
        <Button danger icon={<DeleteOutlined />} style={{ marginTop: 16 }}>
          Delete Project
        </Button>
      </Popconfirm>
    </Card>
  );
}

export default ProjectDeleteSection;
