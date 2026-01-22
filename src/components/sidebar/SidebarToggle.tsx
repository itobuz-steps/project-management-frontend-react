import { PanelLeft } from 'lucide-react';
import type { SidebarToggleProps } from '../../types/sidebar.types';

export default function SidebarToggle({ onToggle }: SidebarToggleProps) {
  return (
    <div className="border-gray absolute top-5 left-2 mt-2 ml-2 flex items-center">
      <button
        id="toggle-sidebar-btn"
        onClick={onToggle}
        className="hover:bg-primary-200 z-18 cursor-pointer rounded"
      >
        <PanelLeft size={25} className="stroke-black" />
      </button>
    </div>
  );
}
