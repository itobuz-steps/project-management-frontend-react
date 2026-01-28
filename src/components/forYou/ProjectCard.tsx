import type { Project } from '../../types/project.types';

export function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="border-s-primary-500 flex min-w-48 cursor-pointer flex-col gap-3 rounded-sm border border-s-2 border-gray-200 bg-white p-4 shadow-sm hover:bg-gray-100 md:min-w-64">
      <p className="font-semibold">{project.name}</p>
      <div className="flex flex-col gap-1">
        <div className="flex justify-between">
          <p>Project Type</p>
          <p>
            {project.projectType.charAt(0).toUpperCase() +
              project.projectType.slice(1)}
          </p>
        </div>
        <div className="flex justify-between">
          <p>Members Assigned</p>
          <p>{project.members.length}</p>
        </div>
      </div>
    </div>
  );
}
