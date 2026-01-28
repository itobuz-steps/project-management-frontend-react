import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../components/sidebar/Sidebar';
import SidebarToggle from '../components/sidebar/SidebarToggle';
import Navbar from '../components/navbar/Navbar';
import TaskDrawer from '../components/taskDrawer/TaskDrawer';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { projectId, type, taskId } = useParams();

  const taskDrawerOpen = Boolean(taskId);
  const openTaskId = taskId ?? null;

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
            navigate(`/dashboard/${projectId}/${type}`, { replace: true });
          }}
        />
      )}
    </div>
  );
}
