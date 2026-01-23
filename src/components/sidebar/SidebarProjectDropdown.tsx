import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { fetchWithAuth } from '../api/interceptor';
import type { Project } from '../../types/project.types';

function SidebarProjectsDropdown() {
  const [projects, setProjects] = useState<Project[]>([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const activeProjectId = searchParams.get('projectId');

  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await fetchWithAuth<Project[]>('/project');
        console.log(res)
        setProjects(res);
      } catch (err) {
        console.error(err);
        setProjects([]);
      }
    }

    loadProjects();
  }, []);

  function handleProjectClick(projectId: string, type: string) {
    navigate(`?projectId=${projectId}&type=${type}`);
  }

  return (
    <>
      {projects.map((project) => (
        <li
          key={project._id}
          onClick={() => handleProjectClick(project._id, project.projectType)}
          className={`hover:bg-primary-100 cursor-pointer rounded px-2 py-1 text-sm ${
            activeProjectId === project._id ? 'bg-primary-200 font-medium' : ''
          }`}
        >
          {project.name}
        </li>
      ))}
    </>
  );
}

export default SidebarProjectsDropdown;
