import { usePermissions } from '../../hooks/usePermissions';
import type { Permission } from '../../utils/permissions';
import { Navigate } from 'react-router-dom';

type Props = {
  permission: Permission;
  children: React.ReactNode;
};

export default function PermissionGuard({ permission, children }: Props) {
  const { can } = usePermissions();

  if (!can(permission)) {
    return <Navigate to="/for-you" replace />;
  }

  return <>{children}</>;
}
