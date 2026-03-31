// ========================= userSlice.js ===================================
// Redux slice for admin user management
// APIs:
//   GET  /api/admin/users          — fetch all users (with optional role filter)
//   POST /api/admin/users/create   — create new user
//   PUT  /api/admin/users/reset-password — reset a user's password
//   POST /api/admin/users/toggle-login   — toggle login permission

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../api/axiosInstance";

// ─────────────────────────────────────────────────────────────────────────────
// THUNKS
// ─────────────────────────────────────────────────────────────────────────────

// Fetch users — optional role filter
export const fetchUsers = createAsyncThunk(
  "users/fetchAll",
  async (roleFilter = "", thunkAPI) => {
    try {
      const res = await apiClient.get("/admin/users/all");
      // Support both { data: [...] } and { data: { users: [...] } }
      const raw = res?.data?.data;
      const users = Array.isArray(raw)
        ? raw
        : [...(raw?.users || []), ...(raw?.admins || [])];
      return users;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch users",
      );
    }
  },
);

// Create new user
export const createUser = createAsyncThunk(
  "users/create",
  async (formData, thunkAPI) => {
    try {
      const res = await apiClient.post("/admin/users/create", formData);
      return res?.data?.data || res?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to create user",
      );
    }
  },
);

// Reset password
export const resetUserPassword = createAsyncThunk(
  "users/resetPassword",
  async ({ userId, email, role, newPassword }, thunkAPI) => {
    try {
      await apiClient.put(`/admin/reset-password/${userId}`, {
        newPassword,
      });
      return { userId, newPassword };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to reset password",
      );
    }
  },
);

// Toggle login permission
export const toggleLoginPermission = createAsyncThunk(
  "users/toggleLogin",
  async ({ userId, role }, thunkAPI) => {
    try {
      const { data } = await apiClient.post(`/admin/logout`, {
        _id: userId,
        role,
      });

      return { userId, isLogin: data.data.isLogin };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to toggle login permission",
      );
    }
  },
);

// ─────────────────────────────────────────────────────────────────────────────
// SLICE
// ─────────────────────────────────────────────────────────────────────────────
const userSlice = createSlice({
  name: "users",
  initialState: {
    list: [], // all fetched users
    loading: false,
    creating: false,
    resetting: false,
    toggling: false, // login permission toggle in progress
    error: null,
    createError: null,
    resetError: null,
  },
  reducers: {
    clearUserErrors: (state) => {
      state.error = null;
      state.createError = null;
      state.resetError = null;
    },
  },
  extraReducers: (builder) => {
    // ── fetchUsers ──────────────────────────────────────────────────────────
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        // Sort alphabetically by name
        state.list = [...action.payload].sort((a, b) => {
          const nameA = a.firstName
            ? `${a.firstName} ${a.lastName}`
            : a.fullName || "";
          const nameB = b.firstName
            ? `${b.firstName} ${b.lastName}`
            : b.fullName || "";
          return nameA.localeCompare(nameB);
        });
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── createUser ──────────────────────────────────────────────────────────
    builder
      .addCase(createUser.pending, (state) => {
        state.creating = true;
        state.createError = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.creating = false;
        // Append new user to list if API returns it
        if (action.payload?._id) {
          state.list.push(action.payload);
        }
      })
      .addCase(createUser.rejected, (state, action) => {
        state.creating = false;
        state.createError = action.payload;
      });

    // ── resetUserPassword ───────────────────────────────────────────────────
    builder
      .addCase(resetUserPassword.pending, (state) => {
        state.resetting = true;
        state.resetError = null;
      })
      .addCase(resetUserPassword.fulfilled, (state, action) => {
        state.resetting = false;
        // Update password in list if backend returns plaintext (optional)
        const { userId, newPassword } = action.payload;
        const user = state.list.find((u) => u._id === userId);
        if (user) user.password = newPassword;
      })
      .addCase(resetUserPassword.rejected, (state, action) => {
        state.resetting = false;
        state.resetError = action.payload;
      });

    // ── toggleLoginPermission ───────────────────────────────────────────────
    builder
      .addCase(toggleLoginPermission.pending, (state) => {
        state.toggling = true;
      })
      .addCase(toggleLoginPermission.fulfilled, (state, action) => {
        state.toggling = false;
        const { userId, isLogin } = action.payload;
        const user = state.list.find((u) => u._id === userId);
        if (user) user.isLogin = isLogin;
      })
      .addCase(toggleLoginPermission.rejected, (state, action) => {
        state.toggling = false;
        state.error = action.payload;
      });
  },
});

export const { clearUserErrors } = userSlice.actions;
export default userSlice.reducer;
