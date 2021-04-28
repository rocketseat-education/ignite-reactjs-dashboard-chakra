import { useAuth } from "../contexts/AuthContext"
import { validateUserRolesAndPermissions } from "../utils/validateUserRolesAndPermissions";

type UseCanParams = {
  permissions?: string[];
  roles?: string[];
}

export function useCan({ permissions, roles }: UseCanParams) {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return false;
  }

  return validateUserRolesAndPermissions({
    user,
    permissions,
    roles,
  });
}