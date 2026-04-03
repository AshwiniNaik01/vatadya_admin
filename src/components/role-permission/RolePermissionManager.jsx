import { useEffect, useState } from "react";
import { FaShieldAlt, FaSpinner, FaCheck, FaChevronDown } from "react-icons/fa";
import { MdSecurity } from "react-icons/md";
import Swal from "sweetalert2";
import apiClient from "../../api/axiosInstance";

const allActions = ["create", "read", "update", "delete"];

const actionMeta = {
  create: {
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    checked: "bg-emerald-500 border-emerald-500",
  },
  read: {
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    checked: "bg-blue-500 border-blue-500",
  },
  update: {
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    checked: "bg-amber-500 border-amber-500",
  },
  delete: {
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    checked: "bg-red-500 border-red-500",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// CUSTOM CHECKBOX
// ─────────────────────────────────────────────────────────────────────────────
function ActionCheckbox({ action, checked, onChange, disabled }) {
  const meta = actionMeta[action];
  return (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      className={`
        w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all duration-150
        ${checked ? `${meta.checked} text-white` : `bg-white ${meta.border} ${meta.color}`}
        ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:scale-110 active:scale-95"}
      `}
    >
      {checked && <FaCheck size={10} />}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const RolePermissionManager = () => {
  const [roles, setRoles] = useState([]);
  const [modules, setModules] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [selectedRoleName, setSelectedRoleName] = useState("");
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const isReadOnly = "";
  const inputCls =
    "w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 " +
    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder:text-slate-400";

  // ── Fetch roles ────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await apiClient.get("/admin/roles/all");
        console.log("Fetched roles:", res.data);
        setRoles(Array.isArray(res?.data?.data) ? res?.data?.data : []);
      } catch (err) {
        console.error("Error fetching roles", err);
      }
    };
    fetchRoles();
  }, []);

  // ── Fetch modules ──────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await apiClient.get("/admin/modules/all");
        console.log("Fetched modules:", res.data);
        if (res.data.success && Array.isArray(res.data.data)) {
          setModules(
            res.data.data.map((m) => ({
              module: m.module.toLowerCase(),
              label: m.module,
            })),
          );
        }
      } catch (err) {
        console.error("Error fetching modules", err);
      }
    };
    fetchModules();
  }, []);

  // ── Load permissions when a role is selected ──────────────────────────────
  useEffect(() => {
    if (!selectedRoleId) return;
    setLoading(true);

    apiClient
      .get(`/admin/roles/${selectedRoleId}`)
      .then((res) => {
        const role = res.data.data;
        setSelectedRoleName(role.role);

        const formatted = {};
        if (
          role.permissions.length === 1 &&
          role.permissions[0].module === "*"
        ) {
          modules.forEach((m) => {
            formatted[m.module] = [...allActions];
          });
        } else {
          modules.forEach((m) => (formatted[m.module] = []));
          role.permissions.forEach((p) => {
            formatted[p.module] = p.actions;
          });
        }
        setPermissions(formatted);
      })
      .catch((err) => {
        Swal.fire(
          "Error",
          err?.response?.data?.message || "Failed to load permissions.",
          "error",
        );
      })
      .finally(() => setLoading(false));
  }, [selectedRoleId, modules]);

  // ── Checkbox toggle ────────────────────────────────────────────────────────
  const handleCheckboxChange = (module, action) => {
    setPermissions((prev) => {
      const current = prev[module] || [];
      const updated = current.includes(action)
        ? current.filter((a) => a !== action)
        : [...current, action];
      return { ...prev, [module]: updated };
    });
  };

  // ── Toggle entire row ──────────────────────────────────────────────────────
  const handleRowToggle = (module) => {
    setPermissions((prev) => {
      const current = prev[module] || [];
      const allSelected = allActions.every((a) => current.includes(a));
      return { ...prev, [module]: allSelected ? [] : [...allActions] };
    });
  };

  // ── Save permissions ───────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setSaving(true);
    const payload = {
      role: selectedRoleName,
      permissions: Object.entries(permissions)
        .filter(([_, actions]) => actions.length > 0)
        .map(([module, actions]) => ({ module, actions })),
    };
    try {
      await apiClient.put(`/admin/roles/update/${selectedRoleId}`, payload);
      Swal.fire({
        icon: "success",
        title: "Permissions saved successfully!",
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire(
        "Error",
        err?.response?.data?.message || "Failed to save permissions.",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  // ── Derived stats ──────────────────────────────────────────────────────────
  const totalGranted = Object.values(permissions).reduce(
    (sum, actions) => sum + actions.length,
    0,
  );
  const totalPossible = modules.length * allActions.length;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* ── Page Header ─────────────────────────────────────────────── */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600 rounded-xl shadow-lg shadow-blue-200">
            <MdSecurity className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Role Based Permission Management
            </h1>
            <p className="text-sm text-slate-500">
              Assign and manage access for roles
            </p>
          </div>
        </div>

        {/* ── Role Selector Card ──────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Select Role
          </label>
          <div className="relative w-full max-w-xs">
            <select
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value)}
              className={`${inputCls} appearance-none pr-9 cursor-pointer`}
            >
              <option value="">— Choose a role —</option>
              {roles.map((role) => (
                <option key={role._id} value={role._id}>
                  {role.role.charAt(0).toUpperCase() + role.role.slice(1)}
                </option>
              ))}
            </select>
            <FaChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              size={11}
            />
          </div>
        </div>

        {/* ── Permissions Table ───────────────────────────────────────── */}
        {selectedRoleId && (
          <>
            {/* Stats + legend bar */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 bg-white border border-slate-100 rounded-xl px-4 py-2 shadow-sm">
                <FaShieldAlt className="text-blue-500" size={13} />
                <span className="text-xs font-semibold text-slate-600">
                  {totalGranted} / {totalPossible} permissions granted
                </span>
                <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{
                      width: totalPossible
                        ? `${(totalGranted / totalPossible) * 100}%`
                        : "0%",
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 ml-auto">
                {allActions.map((action) => {
                  const meta = actionMeta[action];
                  return (
                    <span
                      key={action}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${meta.bg} ${meta.color} ${meta.border}`}
                    >
                      {action.charAt(0).toUpperCase() + action.slice(1)}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-3 text-slate-400">
                  <FaSpinner className="animate-spin text-3xl text-blue-500" />
                  <span className="text-sm font-medium">
                    Loading permissions…
                  </span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50">
                        <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-1/3">
                          Module
                        </th>
                        {allActions.map((action) => {
                          const meta = actionMeta[action];
                          return (
                            <th
                              key={action}
                              className="px-5 py-3.5 text-center text-xs font-bold uppercase tracking-wider"
                            >
                              <span className={meta.color}>
                                {action.charAt(0).toUpperCase() +
                                  action.slice(1)}
                              </span>
                            </th>
                          );
                        })}
                        <th className="px-5 py-3.5 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                          All
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {modules.map((m) => {
                        const modulePerms = permissions[m.module] || [];
                        const allSelected = allActions.every((a) =>
                          modulePerms.includes(a),
                        );
                        return (
                          <tr
                            key={m.module}
                            className="hover:bg-slate-50/80 transition-colors group"
                          >
                            {/* Module name */}
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-2.5">
                                <div className="w-1.5 h-6 rounded-full bg-blue-200 group-hover:bg-blue-400 transition-colors" />
                                <span className="font-semibold text-slate-700">
                                  {m.label}
                                </span>
                                {modulePerms.length > 0 && (
                                  <span className="text-xs font-medium text-blue-600 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded-md">
                                    {modulePerms.length}
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Per-action checkboxes */}
                            {allActions.map((action) => (
                              <td
                                key={action}
                                className="px-5 py-4 text-center"
                              >
                                <div className="flex justify-center">
                                  <ActionCheckbox
                                    action={action}
                                    checked={modulePerms.includes(action)}
                                    onChange={() =>
                                      handleCheckboxChange(m.module, action)
                                    }
                                    disabled={isReadOnly}
                                  />
                                </div>
                              </td>
                            ))}

                            {/* Row select-all toggle */}
                            <td className="px-5 py-4 text-center">
                              <div className="flex justify-center">
                                <button
                                  type="button"
                                  onClick={() => handleRowToggle(m.module)}
                                  disabled={isReadOnly}
                                  className={`
                                    w-8 h-8 rounded-lg border-2 flex items-center justify-center
                                    transition-all duration-150 text-xs font-bold
                                    ${
                                      allSelected
                                        ? "bg-slate-700 border-slate-700 text-white"
                                        : "bg-white border-slate-200 text-slate-400 hover:border-slate-400"
                                    }
                                    ${isReadOnly ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:scale-110 active:scale-95"}
                                  `}
                                >
                                  {allSelected ? <FaCheck size={10} /> : "✦"}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Read-only notice */}
            {isReadOnly && (
              <div className="flex items-center gap-2.5 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm font-medium">
                <FaShieldAlt size={13} />
                <span>
                  Permissions for <strong>{selectedRoleName}</strong> are locked
                  and cannot be modified.
                </span>
              </div>
            )}

            {/* Save button */}
            {!isReadOnly && (
              <div className="flex justify-end">
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700
                    text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-200
                    transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <FaSpinner className="animate-spin" size={13} />
                  ) : (
                    <FaShieldAlt size={13} />
                  )}
                  {saving ? "Saving…" : "Save Permissions"}
                </button>
              </div>
            )}
          </>
        )}

        {/* ── Empty state ─────────────────────────────────────────────── */}
        {!selectedRoleId && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center py-24 gap-3 text-slate-400">
            <MdSecurity className="text-5xl text-slate-200" />
            <p className="font-medium text-slate-500">No role selected</p>
            <p className="text-sm">
              Choose a role above to manage its permissions
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RolePermissionManager;
