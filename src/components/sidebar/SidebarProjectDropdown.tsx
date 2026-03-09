import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getWorkspaces, type Workspace } from '../../services/workspaceService';
import SidebarWorkspaceItem from './SidebarWorkspaceItem';

type SidebarProjectsDropdownProps = {
  collapsed: boolean;
  refreshKey?: number;
};

function SidebarProjectsDropdown({
  collapsed,
  refreshKey = 0,
}: SidebarProjectsDropdownProps) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const navigate = useNavigate();

  const { projectId: activeProjectId } = useParams();

  useEffect(() => {
    async function loadWorkspaces() {
      try {
        const res = await getWorkspaces();
        setWorkspaces(res.result ?? []);
      } catch (err) {
        console.error(err);
        setWorkspaces([]);
      }
    }

    loadWorkspaces();
  }, [refreshKey]);

  function handleProjectClick(projectId: string) {
    navigate(`/project/${projectId}`);
  }

  return (
    <>
      {workspaces.map((workspace) => (
        <SidebarWorkspaceItem
          key={workspace.workspaceId}
          workspace={workspace}
          collapsed={collapsed}
          activeProjectId={activeProjectId}
          onProjectClick={handleProjectClick}
        />
      ))}
      {!workspaces.length && !collapsed && (
        <li className="rounded-md border border-dashed border-slate-300 bg-white/70 px-2 py-2 text-xs font-medium tracking-wide text-slate-500">
          No workspaces yet
        </li>
      )}
    </>
  );
}

export default SidebarProjectsDropdown;
