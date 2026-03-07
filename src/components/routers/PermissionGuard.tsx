import { usePermissions } from '../../hooks/usePermissions';
import type { Permission } from '../../utils/permissions';
import UnauthorizedPage from '../../pages/UnauthorizedPage';

type Props = {
  permission: Permission;
  children: React.ReactNode;
};

export default function PermissionGuard({ permission, children }: Props) {
  const { can } = usePermissions();

  if (!can(permission)) {
    return <UnauthorizedPage />;
  }

  return <>{children}</>;
}
