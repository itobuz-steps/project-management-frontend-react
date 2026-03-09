import type { ReactNode } from 'react';

export type Props = {
  collapsed: boolean;
};

export type SidebarGroupProps = {
  id: string;
  label: string;
  icon: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  collapsed: boolean;
  collapsible?: boolean;
  expanded?: boolean;
  onToggle?: () => void;
};

export type SidebarItemProps = {
  id: string;
  label: string;
  icon: ReactNode;
  collapsed: boolean;
  buttonId?: string;
};

export type SidebarSubItemProps = {
  label: string;
};

export type SidebarToggleProps = {
  onToggle: () => void;
};
