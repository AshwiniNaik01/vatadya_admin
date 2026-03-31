// // redux/slices/permissionsSlice.js
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import apiClient from "../api/axiosConfig";
// // import apiClient from "../../api/axiosConfig";

// // Async thunk to fetch roles & permissions
// export const fetchPermissions = createAsyncThunk(
//   "permissions/fetchPermissions",
//   async (role, thunkAPI) => {
//     try {
//       const res = await apiClient.get("/api/role");
//       const roles = res?.data?.message || [];
//       const matchedRole = roles.find((r) => r.role === role);

//       if (!matchedRole) return {};

//       const permMap = {};
//       matchedRole.permissions.forEach((p) => {
//         permMap[p.module] = p.actions;
//       });

//       return permMap;
//     } catch (err) {
//       return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
//     }
//   }
// );

// const permissionsSlice = createSlice({
//   name: "permissions",
//   initialState: {
//     rolePermissions: {},
//     loading: false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchPermissions.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchPermissions.fulfilled, (state, action) => {
//         state.loading = false;
//         state.rolePermissions = action.payload;
//       })
//       .addCase(fetchPermissions.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export default permissionsSlice.reducer;

// // redux/slices/permissionsSlice.js
// import { createSlice } from "@reduxjs/toolkit";

// const permissionsSlice = createSlice({
//   name: "permissions",
//   initialState: {
//     rolePermissions: {}, // permissions for current user role
//   },
//   reducers: {
//     setPermissions: (state, action) => {
//       state.rolePermissions = action.payload;
//     },
//     clearPermissions: (state) => {
//       state.rolePermissions = {};
//     },
//   },
// });

// export const { setPermissions, clearPermissions } = permissionsSlice.actions;
// export default permissionsSlice.reducer;

// ========================= permissionsSlice.js ===============================
// Manages role-based permissions fetched from:
//   GET /api/admin/permissions/all
//   GET /api/admin/roles/all
//   GET /api/admin/modules/all  ← available if you need module listing

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../api/axiosInstance";

// ─────────────────────────────────────────────────────────────────────────────
// HELPER: Normalize module name (lowercase, no spaces)
// ─────────────────────────────────────────────────────────────────────────────
const normalize = (str) => str?.toLowerCase().replace(/\s+/g, "") || "";

// ─────────────────────────────────────────────────────────────────────────────
// ASYNC THUNK: fetchPermissionsByRole
// Fetches all roles → finds matching role → fetches all permissions → filters
// Dispatches the resulting permMap into Redux state
// ─────────────────────────────────────────────────────────────────────────────
export const fetchPermissionsByRole = createAsyncThunk(
  "permissions/fetchByRole",
  async (userRole, thunkAPI) => {
    try {
      // Step 1: Get all roles
      const rolesRes = await apiClient.get("/admin/roles/all");
      console.log("Fetched roles:", rolesRes?.data);
      const roles = rolesRes?.data?.data || rolesRes?.data || [];

      const matchedRole = roles.find(
        (r) => normalize(r.name) === normalize(userRole),
      );

      if (!matchedRole) {
        // Role not found in DB — return empty permissions
        return {};
      }

      // Step 2: Get all permissions
      const permRes = await apiClient.get("/admin/permissions/all");
      console.log("Fetched permissions:", permRes?.data);
      const allPermissions = permRes?.data?.data || permRes?.data || [];

      // Step 3: Filter permissions for this role
      // Supports both roleId reference and roleName reference
      const rolePerms = allPermissions.filter(
        (p) =>
          p.roleId === matchedRole._id ||
          p.role === matchedRole._id ||
          normalize(p.roleName) === normalize(userRole),
      );

      // Step 4: Build permMap { moduleName: [actions] }
      const permMap = {};
      rolePerms.forEach(({ module, actions }) => {
        if (module) {
          permMap[normalize(module)] = Array.isArray(actions) ? actions : [];
        }
      });

      return permMap;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch permissions",
      );
    }
  },
);

// ─────────────────────────────────────────────────────────────────────────────
// ASYNC THUNK: fetchAllModules
// Fetches module list from GET /api/admin/modules/all
// Useful for dynamic menu building or admin permission management UI
// ─────────────────────────────────────────────────────────────────────────────
export const fetchAllModules = createAsyncThunk(
  "permissions/fetchAllModules",
  async (_, thunkAPI) => {
    try {
      const res = await apiClient.get("/admin/modules/all");
      return res?.data?.data || res?.data || [];
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message || "Failed to fetch modules",
      );
    }
  },
);

// ─────────────────────────────────────────────────────────────────────────────
// SLICE
// ─────────────────────────────────────────────────────────────────────────────
const permissionsSlice = createSlice({
  name: "permissions",
  initialState: {
    rolePermissions: {}, // { moduleName: [actions] }
    allModules: [], // list of all modules from /api/admin/modules/all
    loading: false,
    modulesLoading: false,
    error: null,
  },
  reducers: {
    // Manual override (used if you want to set permissions directly)
    setPermissions: (state, action) => {
      state.rolePermissions = action.payload;
    },
    clearPermissions: (state) => {
      state.rolePermissions = {};
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ── fetchPermissionsByRole ─────────────────────────────────────────────
    builder
      .addCase(fetchPermissionsByRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPermissionsByRole.fulfilled, (state, action) => {
        state.loading = false;
        state.rolePermissions = action.payload;
      })
      .addCase(fetchPermissionsByRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.rolePermissions = {};
      });

    // ── fetchAllModules ────────────────────────────────────────────────────
    builder
      .addCase(fetchAllModules.pending, (state) => {
        state.modulesLoading = true;
      })
      .addCase(fetchAllModules.fulfilled, (state, action) => {
        state.modulesLoading = false;
        state.allModules = action.payload;
      })
      .addCase(fetchAllModules.rejected, (state) => {
        state.modulesLoading = false;
      });
  },
});

export const { setPermissions, clearPermissions } = permissionsSlice.actions;
export default permissionsSlice.reducer;
