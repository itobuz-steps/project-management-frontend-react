import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Select } from 'antd';
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
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | null>(
    null
  );

  const navigate = useNavigate();
  const { projectId: activeProjectId } = useParams();

  useEffect(() => {
    async function loadWorkspaces() {
      try {
        const res = await getWorkspaces();
        const ws = res.result ?? [];

        setWorkspaces(ws);

        const savedWorkspaceId = localStorage.getItem('activeWorkspace');

        if (
          savedWorkspaceId &&
          ws.some((w) => w.workspaceId === savedWorkspaceId)
        ) {
          setSelectedWorkspaceId(savedWorkspaceId);
        } else if (ws.length) {
          setSelectedWorkspaceId(ws[0].workspaceId);
        }
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

  const workspaceOptions = useMemo(
    () =>
      workspaces.map((ws) => ({
        label: ws.workspaceName,
        value: ws.workspaceId,
      })),
    [workspaces]
  );

  const selectedWorkspace = workspaces.find(
    (ws) => ws.workspaceId === selectedWorkspaceId
  );

  return (
    <>
      {!collapsed && (
        <Select
          showSearch
          placeholder="Select workspace"
          options={workspaceOptions}
          value={selectedWorkspaceId}
          onChange={(val) => {
            setSelectedWorkspaceId(val);
            localStorage.setItem('activeWorkspace', val);
          }}
          className="mb-3 w-full"
          optionFilterProp="label"
          suffixIcon={null}
        />
      )}

      {selectedWorkspace && (
        <SidebarWorkspaceItem
          key={selectedWorkspace.workspaceId}
          workspace={selectedWorkspace}
          collapsed={collapsed}
          activeProjectId={activeProjectId}
          onProjectClick={handleProjectClick}
        />
      )}

      {!workspaces.length && !collapsed && (
        <li className="rounded-md border border-dashed border-slate-300 bg-white/70 px-2 py-2 text-xs font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
          No workspaces yet
        </li>
      )}
    </>
  );
}

export default SidebarProjectsDropdown;
