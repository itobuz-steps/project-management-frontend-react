import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/sidebar/Sidebar';
import Navbar from '../components/navbar/Navbar';
import TaskModal from '../components/taskDrawer/TaskModal';
import { CommandPalette } from '../components/common/CommandPalette';
import { useSearchParams } from 'react-router-dom';

export default function MainLayout() {
  // const [collapsed, setCollapsed] = useState(false);
  // const [taskDrawerOpen, setTaskDrawerOpen] = useState(false);
  // const [openTaskId, setOpenTaskId] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [open, setOpen] = useState(false);
  const [paletteSearch, setPaletteSearch] = useState('');

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

  return (
    <div className="relative flex h-screen w-full overflow-hidden">
      <Sidebar />
      <div className="flex w-full flex-1 flex-col overflow-x-auto pl-0 md:pl-0">
        <Navbar />
        <main className="flex-1 overflow-y-auto rounded-lg p-2 md:p-4">
          <Outlet />
        </main>
      </div>

      {taskId && (
        <TaskModal
          taskId={taskId}
          onClose={() =>
            setSearchParams((prev) => {
              const next = new URLSearchParams(prev);
              next.delete('taskId');
              return next;
            })
          }
        />
      )}
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
