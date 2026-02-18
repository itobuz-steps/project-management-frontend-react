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

export const CanAny = ({
  permissions,
  children,
}: {
  permissions: Permission[];
  children: React.ReactNode;
}) => {
  const { canAny } = usePermissions();

  if (!canAny(permissions)) return null;

  return <>{children}</>;
};

export const CanAll = ({
  permissions,
  children,
}: {
  permissions: Permission[];
  children: React.ReactNode;
}) => {
  const { canAll } = usePermissions();

  if (!canAll(permissions)) return null;

  return <>{children}</>;
};
