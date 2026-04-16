import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  resetUserPassword,
  toggleLoginPermission,
  clearUserErrors,
} from "../features/userSlice";
import { usePassword } from "../components/hooks/usePassword";
import apiClient from "../api/axiosInstance";
import {
  FaEye,
  FaEyeSlash,
  FaLockOpen,
  FaSearch,
  FaSpinner,
  FaUser,
  FaTimes,
  FaKey,
} from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";
import Swal from "sweetalert2";
import axiosInstance from "../api/axiosInstance";

// ─────────────────────────────────────────────────────────────────────────────
// TOGGLE SWITCH
// ─────────────────────────────────────────────────────────────────────────────
const ToggleSwitch = ({ checked, onChange, disabled }) => {
  return (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent
        transition-colors duration-200 ease-in-out focus:outline-none
        ${checked ? "bg-blue-600" : "bg-slate-300"}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      <span
        className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow
          transform transition-transform duration-200 ease-in-out
          ${checked ? "translate-x-4" : "translate-x-0"}
        `}
      />
    </button>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PASSWORD INPUT
// ─────────────────────────────────────────────────────────────────────────────
const PasswordInput = ({
  value,
  onChange,
  placeholder = "Password",
  label,
}) => {
  const [visible, setVisible] = useState(false);
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 pr-10
            text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500
            focus:border-transparent transition"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          {visible ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MODAL
// ─────────────────────────────────────────────────────────────────────────────
const Modal = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden z-10">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h2 className="text-base font-bold text-slate-800">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
          >
            <FaTimes size={13} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
        {footer && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ROLE BADGE
// ─────────────────────────────────────────────────────────────────────────────
const roleBadgeColors = {
  superadmin: "bg-purple-100 text-purple-700 border-purple-200",
  admin: "bg-blue-100 text-blue-700 border-blue-200",
  default: "bg-slate-100 text-slate-600 border-slate-200",
};

const RoleBadge = ({ role }) => {
  const color = roleBadgeColors[role?.toLowerCase()] || roleBadgeColors.default;
  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${color}`}
    >
      {role ? role.charAt(0).toUpperCase() + role.slice(1) : "—"}
    </span>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PASSWORD CELL (per-row reveal)
// ─────────────────────────────────────────────────────────────────────────────
const PasswordCell = ({ password, role }) => {
  const [visible, setVisible] = useState(false);

  // For plain users, just show a dash — no dots, no eye icon
  if (role?.toLowerCase() === "user") {
    return <span className="text-slate-400 text-sm">—</span>;
  }

  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-xs text-slate-700 min-w-[80px]">
        {visible ? password || "—" : "••••••••"}
      </span>
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="text-slate-400 hover:text-blue-500 transition"
      >
        {visible ? <FaEyeSlash size={13} /> : <FaEye size={13} />}
      </button>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const UserManagement = () => {
  const dispatch = useDispatch();
  const {
    list: users,
    loading,
    resetting,
    toggling,
    resetError,
  } = useSelector((state) => state.users);

  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [search, setSearch] = useState("");

  // Reset password modal
  const [resetTarget, setResetTarget] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState("");

  const {
    password: newPassword,
    setPassword: setNewPassword,
    generate: generatePassword,
  } = usePassword("");

  // ── Fetch roles for dropdown ───────────────────────────────────────────────
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await apiClient.get("/admin/roles/all");
        const data = res?.data?.data || res?.data || [];
        setRoles(data);
      } catch (err) {
        console.error("Failed to fetch roles", err);
      }
    };
    fetchRoles();
  }, []);

  // ── Fetch all users once on mount ─────────────────────────────────────────
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // ── Clear Redux errors when reset modal opens ─────────────────────────────
  useEffect(() => {
    if (resetTarget) {
      dispatch(clearUserErrors());
      setNewPassword("");
      setConfirmPassword("");
    }
  }, [resetTarget]);

  // ── Filtered users: client-side search + role filter ──────────────────────
  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase().trim();

    const matchesSearch =
      !q ||
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q);

    const matchesRole =
      !selectedRole || u.role?.toLowerCase() === selectedRole.toLowerCase();

    return matchesSearch && matchesRole;
  });

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleToggleLogin = async (user) => {
    const result = await dispatch(
      toggleLoginPermission({
        userId: user._id,
        role: user.role,
      }),
    );
    if (toggleLoginPermission.rejected.match(result)) {
      Swal.fire(
        "Error",
        result.payload || "Failed to toggle permission",
        "error",
      );
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Swal.fire("Validation", "Both fields are required.", "warning");
      return;
    }
    if (newPassword !== confirmPassword) {
      Swal.fire("Mismatch", "Passwords do not match.", "error");
      return;
    }
    const result = await dispatch(
      resetUserPassword({
        userId: resetTarget._id,
        email: resetTarget.email,
        role: resetTarget.role,
        newPassword,
      }),
    );
    if (resetUserPassword.fulfilled.match(result)) {
      Swal.fire({
        icon: "success",
        title: "Password Reset",
        timer: 1800,
        showConfirmButton: false,
      });
      setResetTarget(null);
    } else {
      Swal.fire("Error", result.payload || "Failed to reset password", "error");
    }
  };

  const inputCls =
    "w-[400px] bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 " +
    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder:text-slate-400";

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/user/${id}`);
      // refresh users list

      dispatch(fetchUsers());
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* ── Page Header ──────────────────────────────────────────────── */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600 rounded-xl shadow-lg shadow-blue-200">
            <MdAdminPanelSettings className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              User Management
            </h1>
            <p className="text-sm text-slate-500">
              {filteredUsers.length} of {users.length} user
              {users.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* ── Filters Bar ──────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <FaSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={13}
            />
            <input
              type="text"
              placeholder="Search by name, email, role…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`${inputCls} pl-9`}
            />
          </div>

          {/* Role filter */}
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className={`${inputCls}  min-w-[400px]`}
          >
            <option value="">All Roles</option>
            {roles.map((r) => (
              <option key={r._id} value={r.name || r.role}>
                {(r.name || r.role || "").charAt(0).toUpperCase() +
                  (r.name || r.role || "").slice(1)}
              </option>
            ))}
          </select>

          {/* Clear filters — shown only when something is active */}
          {(search || selectedRole) && (
            <button
              onClick={() => {
                setSearch("");
                setSelectedRole("");
              }}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold
                text-slate-500 bg-white border border-slate-200 rounded-lg
                hover:bg-slate-50 transition whitespace-nowrap"
            >
              <FaTimes size={10} />
              Clear filters
            </button>
          )}
        </div>

        {/* ── Table Card ───────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3 text-slate-400">
              <FaSpinner className="animate-spin text-3xl text-blue-500" />
              <span className="text-sm font-medium">Loading users…</span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-2 text-slate-400">
              <FaUser className="text-4xl text-slate-300" />
              <p className="font-medium">No users found</p>
              <p className="text-sm">Try a different role or search term</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    {[
                      "#",
                      "Name",
                      "Email",
                      "Role",
                      "Login Access",
                      "Password",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-3.5 text-left text-xs font-bold text-slate-500
                          uppercase tracking-wider whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredUsers.map((user, idx) => (
                    <tr
                      key={user._id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      <td className="px-5 py-4 text-slate-400 text-xs font-mono">
                        {idx + 1}
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-medium text-slate-800 whitespace-nowrap">
                          {user.name || ""}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-500 whitespace-nowrap">
                        {user.email || "—"}
                      </td>
                      <td className="px-5 py-4">
                        <RoleBadge role={user.role} />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <ToggleSwitch
                            checked={!!user.isLogin}
                            onChange={() => handleToggleLogin(user)}
                            disabled={toggling}
                          />
                          <span
                            className={`text-xs font-medium ${user.isLogin ? "text-blue-600" : "text-slate-400"}`}
                          >
                            {user.isLogin ? "Active" : "Revoked"}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <PasswordCell
                          password={user.password}
                          role={user.role}
                        />
                      </td>
                      <td className="p flex x-5 py-4">
                        <button
                          onClick={() => setResetTarget(user)}
                          disabled={user.role?.toLowerCase() === "user"}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold
                            text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg
                            border border-blue-100 transition-all active:scale-95
                            disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-blue-50"
                        >
                          <FaKey size={10} />
                          Reset
                        </button>
                        {/* <button
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold 
                          text-red-600 bg-red-50 hover:bg-red-100 rounded-lg 
                           border border-red-100 transition-all active:scale-95"
                        >
                          <MdDeleteForever size={20} />
                        </button> */}

                        <button
                          onClick={() => handleDelete(user._id)}
                          disabled={user.role === "admin"}
                          className={`p-2 rounded-lg transition-all
    ${
      user.role === "admin"
        ? "opacity-40 cursor-not-allowed"
        : "hover:bg-red-50 active:scale-95"
    }
  `}
                        >
                          <MdDeleteForever size={20} className="text-red-600" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          RESET PASSWORD MODAL
      ════════════════════════════════════════════════════════════════════ */}
      <Modal
        isOpen={!!resetTarget}
        onClose={() => setResetTarget(null)}
        title="Reset Password"
        footer={
          <>
            <button
              onClick={() => setResetTarget(null)}
              className="px-4 py-2 text-sm font-medium text-slate-600 bg-white
                border border-slate-200 rounded-lg hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleResetPassword}
              disabled={resetting}
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold
                text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition
                disabled:opacity-60 disabled:cursor-not-allowed active:scale-95"
            >
              {resetting ? (
                <FaSpinner className="animate-spin" size={13} />
              ) : (
                <FaLockOpen size={13} />
              )}
              {resetting ? "Saving…" : "Save Password"}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
              {(
                resetTarget?.firstName?.[0] ||
                resetTarget?.fullName?.[0] ||
                "?"
              ).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">
                {resetTarget?.firstName
                  ? `${resetTarget.firstName} ${resetTarget.lastName || ""}`
                  : resetTarget?.fullName}
              </p>
              <p className="text-xs text-slate-500">{resetTarget?.email}</p>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex gap-2">
              <div className="flex-1">
                <PasswordInput
                  label="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </div>
              <button
                type="button"
                onClick={() => generatePassword(8)}
                className="self-end px-3 py-2.5 text-xs font-semibold text-blue-600
                  bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-lg transition"
              >
                Generate
              </button>
            </div>
          </div>

          <PasswordInput
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter new password"
          />

          {confirmPassword && (
            <p
              className={`text-xs font-medium ${
                newPassword === confirmPassword
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {newPassword === confirmPassword
                ? "✓ Passwords match"
                : "✗ Passwords do not match"}
            </p>
          )}

          {resetError && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {resetError}
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default UserManagement;
