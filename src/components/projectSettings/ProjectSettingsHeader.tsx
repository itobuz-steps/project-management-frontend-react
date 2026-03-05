import { Avatar, Row, Col, Tag, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useState } from 'react';
import type { ProjectSettingsHeaderProps } from './projectSettings.type';

const { Title, Text } = Typography;

function ProjectSettingsHeader({ project }: ProjectSettingsHeaderProps) {
  const [iconPreview] = useState<string | null>(project.icon ?? null);

  return (
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
  );
}

export default ProjectSettingsHeader;
