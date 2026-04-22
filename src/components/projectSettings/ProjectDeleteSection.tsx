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
      window.dispatchEvent(new CustomEvent('project-list-changed'));
      navigate('/for-you');
    } catch {
      message.error('Failed to delete project');
    }
  };

  return (
    <Card
      style={{
        marginTop: 10,
        borderRadius: 10,
        border: '1px solid #ffccc7',
      }}
    >
      <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <Title level={5} style={{ color: '#cf1322', marginBottom: 4 }}>
            Delete Project
          </Title>

          <Text type="danger">
            Deleting this project will permanently remove all tasks and sprints.
          </Text>
        </div>

        <Popconfirm
          title="Delete this project?"
          description="This action cannot be undone."
          okText="Delete"
          cancelText="Cancel"
          okButtonProps={{
            style: {
              backgroundColor: 'red',
              color: 'white',
            },
          }}
          cancelButtonProps={{
            style: {
              border: 'var(--color-primary-500) solid 1px',
            },
            type: 'text',
          }}
          onConfirm={handleDelete}
        >
          <Button danger icon={<DeleteOutlined />} style={{ alignSelf: 'end' }}>
            Delete Project
          </Button>
        </Popconfirm>
      </div>
    </Card>
  );
}

export default ProjectDeleteSection;
