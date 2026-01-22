import { useState } from 'react';
import Sidebar from '../components/sidebar/Sidebar';
import SidebarToggle from '../components/sidebar/SidebarToggle';
import Navbar from '../components/navbar/Navbar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="relative flex h-screen w-full overflow-hidden">
      <SidebarToggle onToggle={() => setCollapsed((prev) => !prev)} />

      <Sidebar collapsed={collapsed} />

      <div className="flex flex-1 flex-col">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
