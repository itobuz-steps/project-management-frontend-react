import { useEffect, useState } from 'react';
import { getAllProjects } from '../../services/projectService';
import type { Project } from '../../types/project.types';
import { ProjectCard } from './ProjectCard';

export function ProjectContainer() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    async function fetchProjects() {
      const projects = await getAllProjects();
      setProjects(projects);
    }
    fetchProjects();
  }, []);

  return (
    <div id="forYouProjects" className="mb-4 flex flex-col gap-2">
      <h2 className="font-semibold dark:text-slate-100">Your Projects</h2>
      <div
        id="forYouProjectsContainer"
        className="xs:flex-row flex flex-col flex-wrap gap-2"
      >
        {projects.length === 0 ? (
          <div className="flex w-full justify-center bg-gray-50 p-5 text-center font-semibold text-gray-400 dark:bg-slate-800 dark:text-slate-400">
            No projects found!
          </div>
        ) : (
          projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))
        )}
      </div>
    </div>
  );
}
