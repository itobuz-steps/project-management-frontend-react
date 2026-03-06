import { Avatar, Upload, Button, Tag } from 'antd';
import { UserOutlined, UploadOutlined, CloseOutlined } from '@ant-design/icons';
import type { ProjectSettingsHeaderProps } from './projectSettings.type';

function ProjectSettingsHeader({
  project,
  iconFile,
  iconPreview,
  setIconFile,
  setIconPreview,
}: ProjectSettingsHeaderProps) {
  return (
    <div
      style={{
        background: 'var(--color-primary-100)',
        borderRadius: 16,
        padding: 32,
        marginBottom: -20,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
      }}
    >
      <Avatar
        size={96}
        src={iconPreview ?? undefined}
        icon={!iconPreview && <UserOutlined />}
      >
        {!iconPreview && project.name?.[0]}
      </Avatar>

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Tag color="blue">{iconFile.name}</Tag>

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
    </div>
  );
}

export default ProjectSettingsHeader;
