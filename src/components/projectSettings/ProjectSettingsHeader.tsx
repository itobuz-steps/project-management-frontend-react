import { useState } from 'react';
import { Avatar, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { ProjectSettingsHeaderProps } from './projectSettings.type';
import { ThemePicker } from '../navbar/ThemePicker';
import { fallbackProjectIcons } from '../../config/constants';

function ProjectSettingsHeader({
  project,
  iconPreview,
  setIconFile,
  setIconPreview,
  theme,
  setTheme,
}: ProjectSettingsHeaderProps) {
  const [imageSrc] = useState(() => {
    if (iconPreview) {
      return iconPreview;
    }

    // Check if we already have a stored fallback for this project
    const storedFallback = localStorage.getItem(`fallback-icon-${project._id}`);
    if (storedFallback) {
      return storedFallback;
    }

    // Pick a random fallback and save it
    const randomFallback =
      fallbackProjectIcons[
        Math.floor(Math.random() * fallbackProjectIcons.length)
      ];
    localStorage.setItem(`fallback-icon-${project._id}`, randomFallback);
    return randomFallback;
  });

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
      <Avatar size={96} src={imageSrc}>
        {!imageSrc && project.name?.[0]}
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
