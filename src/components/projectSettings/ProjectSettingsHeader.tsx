import { Avatar, Upload, Button } from 'antd';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';
import type { ProjectSettingsHeaderProps } from './projectSettings.type';
import { ThemePicker } from '../navbar/ThemePicker';

function ProjectSettingsHeader({
  project,
  iconPreview,
  setIconFile,
  setIconPreview,
  theme,
  setTheme,
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

      {/* Theme Picker */}
      <ThemePicker value={theme} onChange={setTheme} />
    </div>
  );
}

export default ProjectSettingsHeader;
