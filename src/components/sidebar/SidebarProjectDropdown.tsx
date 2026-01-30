import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchWithAuth } from '../api/interceptor';
import type { Project } from '../../types/project.types';

function SidebarProjectsDropdown({ collapsed }: { collapsed: boolean }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const navigate = useNavigate();

  const { projectId: activeProjectId } = useParams();

  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await fetchWithAuth<Project[]>('/project');
        console.log(res);
        setProjects(res);
      } catch (err) {
        console.error(err);
        setProjects([]);
      }
    }

    loadProjects();
  }, []);

  function handleProjectClick(projectId: string) {
    navigate(`/project/${projectId}`);
  }

  return (
    <>
      {projects.map((project) => (
        <li
          key={project._id}
          onClick={() => handleProjectClick(project._id)}
          className={`hover:bg-primary-100 cursor-pointer truncate rounded px-2 py-1 text-sm whitespace-nowrap transition-all duration-300 ease-in-out ${
            activeProjectId === project._id ? 'bg-primary-200 font-medium' : ''
          } ${collapsed ? '-translate-x-2 opacity-0' : 'translate-x-0 opacity-100'}`}
        >
          {project.name}
        </li>
      ))}
    </>
  );
}

export default SidebarProjectsDropdown;
