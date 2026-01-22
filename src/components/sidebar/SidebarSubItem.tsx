type SidebarSubItemProps = {
  label: string;
};

export default function SidebarSubItem({ label }: SidebarSubItemProps) {
  return (
    <li className="hover:bg-primary-100 cursor-pointer rounded p-1">{label}</li>
  );
}
