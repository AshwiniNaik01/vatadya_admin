import { useAuth } from "../../contexts/AuthContest";

export function usePermissions() {
  const { user } = useAuth();

  const hasPermission = (module, action) => {
    if (!user || !user.permissions) return false;

    // If superadmin, allow everything
    if (user.role === "superadmin") return true;

    const modulePermissions = user.permissions[module];
    if (!modulePermissions) return false;

    return modulePermissions.includes(action);
  };

  return { hasPermission };
}
