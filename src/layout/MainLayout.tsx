import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../components/sidebar/Sidebar';
import Navbar from '../components/navbar/Navbar';
import TaskDrawer from '../components/taskDrawer/taskDrawer';
import { CommandPalette } from '../components/common/CommandPalette';
import { useSearchParams } from 'react-router-dom';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const [taskDrawerOpen, setTaskDrawerOpen] = useState(false);
  // const [openTaskId, setOpenTaskId] = useState<string | null>(null);
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

    setSearchParams(next, { replace: true });
  };
  const navigate = useNavigate();
  const { projectId, taskId } = useParams();

  const taskDrawerOpen = Boolean(taskId);
  const openTaskId = taskId ?? null;

  return (
    <div className="relative flex h-screen w-full overflow-hidden">
      <Sidebar />

      <div className="flex w-full flex-1 flex-col overflow-x-auto pl-0 md:pl-0">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 pt-16 md:pt-6">
          {children}
        </main>
      </div>

      {taskDrawerOpen && openTaskId && (
        <TaskDrawer
          taskId={openTaskId}
          onClose={() => {
            navigate(`/dashboard/${projectId}`, { replace: true });
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
