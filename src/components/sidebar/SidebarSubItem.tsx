import type { SidebarSubItemProps } from "../../types/sidebar.types";

export default function SidebarSubItem({ label }: SidebarSubItemProps) {
  return (
    <li className="hover:bg-primary-100 cursor-pointer rounded p-1">{label}</li>
  );
}
