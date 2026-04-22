import { useMemo, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Select } from 'antd';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getWorkspaces } from '../../services/workspaceService';
import SidebarWorkspaceItem from './SidebarWorkspaceItem';

type SidebarProjectsDropdownProps = {
  collapsed: boolean;
  refreshKey?: number;
};

function SidebarProjectsDropdown({
  collapsed,
  refreshKey = 0,
}: SidebarProjectsDropdownProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { projectId: activeProjectId } = useParams();

  // Tracks only explicit user selections in the dropdown
  const [manualSelection, setManualSelection] = useState<string | null>(null);

  const { data: workspaces = [] } = useQuery({
    queryKey: ['workspaces', refreshKey],
    queryFn: async () => {
      const res = await getWorkspaces();
      return res.result ?? [];
    },
  });

  // Derived — no setState, no effect
  const selectedWorkspaceId = useMemo(() => {
    if (!workspaces.length) return null;
    const target = manualSelection ?? localStorage.getItem('activeWorkspace');
    if (target && workspaces.some((w) => w.workspaceId === target))
      return target;
    return workspaces[0].workspaceId;
  }, [workspaces, manualSelection]);

  // Invalidate query (not setState) when a project mutation fires
  useEffect(() => {
    const handler = () =>
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
    window.addEventListener('project-list-changed', handler);
    return () => window.removeEventListener('project-list-changed', handler);
  }, [queryClient]);

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
            setManualSelection(val);
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
