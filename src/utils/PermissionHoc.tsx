import { usePermissions } from '../hooks/usePermissions';
import type { Permission } from './permissions';

type CanProps = {
  permission: Permission;
  children: React.ReactNode;
};

export const Can = ({ permission, children }: CanProps) => {
  const { can } = usePermissions();

  if (!can(permission)) return null;

  return <>{children}</>;
};

type CanAnyProps = {
  permissions: Permission[];
  children: React.ReactNode;
};

export const CanAny = ({ permissions, children }: CanAnyProps) => {
  const { canAny } = usePermissions();

  if (!canAny(permissions)) return null;

  return <>{children}</>;
};

type CanAllProps = {
  permissions: Permission[];
  children: React.ReactNode;
};

export const CanAll = ({ permissions, children }: CanAllProps) => {
  const { canAll } = usePermissions();

  if (!canAll(permissions)) return null;

  return <>{children}</>;
};
