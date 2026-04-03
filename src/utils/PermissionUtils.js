/**
 * Checks if the user can access a specific module based on their permissions.
 * @param {Object} rolePermissions - The mapped permission object (module -> actions[]).
 * @param {String} moduleName - The name of the module to check.
 * @returns {Boolean}
 */
export const canAccessModule = (rolePermissions, moduleName) => {
  if (!rolePermissions) return false;
  // Wildcard key — superadmin has access to everything
  if (rolePermissions["*"]) return true;
  if (moduleName === "*") return true;
  return !!rolePermissions[moduleName];
};

/**
 * Checks if the user can perform a specific action (read, create, update, delete) in a module.
 * @param {Object} rolePermissions - The mapped permission object (module -> actions[]).
 * @param {String} moduleName - The name of the module to check.
 * @param {String} action - The action to check.
 * @returns {Boolean}
 */
export const canPerformAction = (rolePermissions, moduleName, action) => {
  if (!rolePermissions) return false;
  // Wildcard key — superadmin can perform any action
  if (rolePermissions["*"]) return true;
  if (moduleName === "*") return true;
  const moduleActions = rolePermissions[moduleName] || [];
  return moduleActions.includes(action);
};
