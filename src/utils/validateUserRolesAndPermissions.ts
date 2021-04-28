import { User } from "../contexts/AuthContext";

type ValidateRolesAndPermissionsParams = {
  user: User;
  permissions?: string[];
  roles?: string[];
}

export function validateUserRolesAndPermissions({ 
  permissions, 
  roles, 
  user 
}: ValidateRolesAndPermissionsParams) {
  if (permissions?.length > 0) {
    const hasAllPermissions = permissions.every((permission) => {
      return user.permissions.includes(permission);
    });

    if (!hasAllPermissions) {
      return false;
    }
  }

  if (roles?.length > 0) {
    const hasAllRoles = roles.every((role) => {
      return user.roles.includes(role);
    });

    if (!hasAllRoles) {
      return false;
    }
  }

  return true;
}