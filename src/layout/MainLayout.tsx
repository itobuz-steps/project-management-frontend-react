import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/sidebar/Sidebar';
import Navbar from '../components/navbar/Navbar';
import TaskDrawer from '../components/drawer/TaskDrawer';
import { CommandPalette } from '../components/common/CommandPalette';
import { useSearchParams } from 'react-router-dom';
import TaskModal from '../components/taskModal/TaskModal';

export default function MainLayout() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [open, setOpen] = useState(false);
  const [paletteSearch, setPaletteSearch] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);

  // Cmd + K / Ctrl + K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const taskId = searchParams.get('taskId');

  const location = useLocation();
  const view = searchParams.get('view');

  const isBacklog = location.pathname.includes('/backlog');
  const isDrawerView = view === 'drawer' || (isBacklog && !view);
  const isTaskDrawerOpen = Boolean(taskId && isDrawerView);

  const closeTaskPanel = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete('taskId');
      next.delete('view');
      return next;
    });
  };

  useEffect(() => {
    if (!isTaskDrawerOpen) {
      return;
    }

    const handleSidebarClose = () => {
      setSidebarCollapsed(true);
      setSidebarMobileOpen(false);
    };

    handleSidebarClose();
  }, [isTaskDrawerOpen]);

  const handleSidebarOpen = () => {
    if (isTaskDrawerOpen) {
      closeTaskPanel();
    }
  };

  const toggleView = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      const currentView = next.get('view');

      const effectiveView = currentView ?? (isBacklog ? 'drawer' : 'modal');

      if (effectiveView === 'drawer') {
        next.set('view', 'modal');
      } else {
        next.set('view', 'drawer');
      }

      return next;
    });
  };

  return (
    <div className="relative flex h-screen w-full overflow-hidden">
      <Sidebar
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
        mobileOpen={sidebarMobileOpen}
        onMobileOpenChange={setSidebarMobileOpen}
        onSidebarOpen={handleSidebarOpen}
      />
      <div className="flex w-full flex-1 flex-col overflow-x-auto pl-0 md:pl-0">
        <Navbar />
        <main className="flex-1 overflow-y-auto rounded-lg p-2 md:p-4">
          <Outlet />
        </main>
      </div>

      {taskId ? (
        isTaskDrawerOpen ? (
          <TaskDrawer
            taskId={taskId}
            onClose={closeTaskPanel}
            onToggleView={toggleView}
            isDrawerView={true}
          />
        ) : (
          <TaskModal
            taskId={taskId}
            onClose={closeTaskPanel}
            onToggleView={toggleView}
            isDrawerView={false}
          />
        )
      ) : null}

      <CommandPalette
        open={open}
        onClose={() => {
          setOpen(false);
          setPaletteSearch('');
        }}
        value={paletteSearch}
        onChange={setPaletteSearch}
      />
    </div>
  );
}
