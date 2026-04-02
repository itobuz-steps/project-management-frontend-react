import type { ViewMode } from '../../types/TopBar.types';
import { NavLink, useLocation  } from 'react-router-dom';
import { useMemo } from 'react';
import { useProject } from '../../context/ProjectContext';
import { Tabs } from 'antd';
import { usePermissions } from '../../hooks/usePermissions';

function TopBar() {
  const location = useLocation();
  const { project } = useProject();
  const { can } = usePermissions();

  const type = project?.projectType;
  const isScrum = type === 'scrum';

  const views: { label: string; value: ViewMode }[] = useMemo(() => {
    const base: { label: string; value: ViewMode }[] = [
      { label: 'Backlog', value: 'backlog' },
      { label: 'Board', value: 'board' },
      { label: 'List', value: 'list' },
    ];

    if (isScrum) {
      base.push({ label: 'Sprints', value: 'sprints-overview' });
      base.push({ label: 'Timeline', value: 'timeline' });
    }

    if (can('PROJECT_AUDIT_LOG_VIEW')) {
      base.push({ label: 'Audit Logs', value: 'logs' });
      base.push({ label: 'Analytics', value: 'analytics' });
    }

    return base;
  }, [can, isScrum]);

  const activeView = useMemo(() => {
    const matched = views.find((view) =>
      location.pathname.endsWith(`/${view.value}`)
    );
    return matched?.value;
  }, [location.pathname, views]);

  const tabItems = useMemo(
    () =>
      views.map((view) => ({
        key: view.value,
        label: (
          <NavLink
            to={view.value}
            className="text-sm font-medium transition"
            style={{ color: 'inherit' }}
          >
            {view.label}
          </NavLink>
        ),
      })),
    [views]
  );

  return (
    <header className="flex flex-col gap-1.5 sm:gap-2">
      <div className="">
        <Tabs activeKey={activeView} items={tabItems} />
      </div>
    </header>
  );
}

export default TopBar;
