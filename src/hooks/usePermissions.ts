// usePermissions.ts
import { useMemo, useCallback } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { getPermissionsByRole, type Permission } from '../utils/permissions';

export const usePermissions = () => {
  const { role } = useAuthContext();

  /**
   * Memoize permissions as a Set
   * Recalculates ONLY when role changes
   */
  const permissionSet = useMemo(() => {
    return new Set(getPermissionsByRole(role));
  }, [role]);

  /**
   * Stable function reference
   * Changes ONLY if permissionSet changes
   */
  const can = useCallback(
    (permission: Permission) => {
      return permissionSet.has(permission);
    },
    [permissionSet]
  );

  /**
   * Optional helper for multiple permissions
   */
  const canAny = useCallback(
    (permissions: Permission[]) => {
      return permissions.some((permission) => permissionSet.has(permission));
    },
    [permissionSet]
  );

  const canAll = useCallback(
    (permissions: Permission[]) => {
      return permissions.every((permission) => permissionSet.has(permission));
    },
    [permissionSet]
  );

  return {
    role,
    can,
    canAny,
    canAll,
  };
};
