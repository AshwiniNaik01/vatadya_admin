import { usePermissions } from "../hooks/usePermissions";

export default function PermissionGuard({
  module,
  action,
  children,
  fallback = null,
}) {
  const { hasPermission } = usePermissions();

  if (!hasPermission(module, action)) return fallback;

  return children;
}
