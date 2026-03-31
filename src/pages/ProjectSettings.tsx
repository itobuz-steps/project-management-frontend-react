import { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { useProjectMetaData } from '../hooks/useProjectMetaData';
import ProjectSettingsHeader from '../components/projectSettings/ProjectSettingsHeader';
import ProjectSettingsForm from '../components/projectSettings/ProjectSettingsForm';
import ProjectDeleteSection from '../components/projectSettings/ProjectDeleteSection';
import type { Project } from '../types/project.types';
import type { User } from '../services/types/tasks.types';

function ProjectSettings() {
  const { project, setProject } = useProject();
  const { members } = useProjectMetaData(project?._id);

  if (!project) {
    return null;
  }

  return (
    <ProjectSettingsContent
      key={project._id}
      project={project}
      setProject={setProject}
      members={members}
    />
  );
}

interface ProjectSettingsContentProps {
  project: Project;
  members: User[];
  setProject: (project?: Project) => void;
}

function ProjectSettingsContent({
  project,
  members,
  setProject,
}: ProjectSettingsContentProps) {
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(
    project?.icon ?? null
  );
  const [theme, setTheme] = useState<string>(project?.theme ?? 'indigo');

  return (
    <div style={{ padding: 10, maxWidth: 700, margin: 'auto' }}>
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
