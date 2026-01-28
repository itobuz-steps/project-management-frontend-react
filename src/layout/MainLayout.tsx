import { useEffect, useState } from 'react';
import Sidebar from '../components/sidebar/Sidebar';
import SidebarToggle from '../components/sidebar/SidebarToggle';
import Navbar from '../components/navbar/Navbar';
import { useSearchParams } from 'react-router-dom';
import TaskDrawer from '../components/taskDrawer/taskDrawer';
import { CommandPalette } from '../components/common/CommandPalette';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [taskDrawerOpen, setTaskDrawerOpen] = useState(false);
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [open, setOpen] = useState(false);
  const searchValue = searchParams.get('searchInput') || '';

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
  const updateSearch = (value: string) => {
    const next = new URLSearchParams(searchParams);

    if (value.trim()) {
      next.set('searchInput', value);
    } else {
      next.delete('searchInput');
    }

    setSearchParams(next);
  };

  useEffect(() => {
    async function syncTaskDrawerWithUrl() {
      if (searchParams.get('taskId')) {
        setOpenTaskId(searchParams.get('taskId'));
        setTaskDrawerOpen(true);
      } else {
        setOpenTaskId(null);
        setTaskDrawerOpen(false);
      }
    }

    syncTaskDrawerWithUrl();
  }, [searchParams]);

  return (
    <div className="relative flex h-screen w-full overflow-hidden">
      <SidebarToggle onToggle={() => setCollapsed((prev) => !prev)} />

      <Sidebar collapsed={collapsed} />

      <div className="flex w-full flex-1 flex-col overflow-x-auto">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
      {taskDrawerOpen && openTaskId && (
        <TaskDrawer
          taskId={openTaskId}
          onClose={() => {
            searchParams.delete('taskId');
            setSearchParams(searchParams);
          }}
        />
      )}
      <CommandPalette
        open={open}
        onClose={() => setOpen(false)}
        value={searchValue}
        onChange={updateSearch}
      />
    </div>
  );
}
