import { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { useProjectMetaData } from '../hooks/useProjectMetaData';
import ProjectSettingsHeader from '../components/projectSettings/ProjectSettingsHeader';
import ProjectSettingsForm from '../components/projectSettings/ProjectSettingsForm';
import ProjectDeleteSection from '../components/projectSettings/ProjectDeleteSection';

function ProjectSettings() {
  const { project, setProject } = useProject();
  const { members } = useProjectMetaData(project?._id);

  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(
    project?.icon ?? null
  );
  const [theme, setTheme] = useState<string>(project?.theme ?? 'indigo');

  if (!project) {
    return null;
  }

  return (
    <div style={{ padding: 10, maxWidth: 800, margin: 'auto' }}>
      <ProjectSettingsHeader
        project={project}
        iconFile={iconFile}
        iconPreview={iconPreview ?? project.icon ?? null}
        setIconFile={setIconFile}
        setIconPreview={setIconPreview}
        theme={theme}
        setTheme={setTheme}
      />

      <ProjectSettingsForm
        project={project}
        members={members}
        setProject={setProject}
        iconFile={iconFile}
        setIconFile={setIconFile}
        setIconPreview={setIconPreview}
        theme={theme}
      />

      <ProjectDeleteSection projectId={project._id} />
    </div>
  );
}

export default ProjectSettings;
