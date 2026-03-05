import { useProject } from '../context/ProjectContext';
import { useProjectMetaData } from '../hooks/useProjectMetaData';
import ProjectSettingsHeader from '../components/projectSettings/ProjectSettingsHeader';
import ProjectSettingsForm from '../components/projectSettings/ProjectSettingsForm';
import ProjectDeleteSection from '../components/projectSettings/ProjectDeleteSection';

function ProjectSettings() {
  const { project, setProject } = useProject();
  const { members } = useProjectMetaData(project?._id);

  if (!project) {
    return null;
  }

  return (
    <div style={{ padding: 10, maxWidth: 800, margin: 'auto' }}>
      <ProjectSettingsHeader project={project} />

      <ProjectSettingsForm
        project={project}
        members={members}
        setProject={setProject}
      />

      <ProjectDeleteSection projectId={project._id} />
    </div>
  );
}

export default ProjectSettings;
