// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import permissionsReducer from "../features/permissionsSlice";
import roleReducer from "../features/roleSlice";
import userReducer from "../features/userSlice"; // ← add this

export const store = configureStore({
  reducer: {
    permissions: permissionsReducer,
    role: roleReducer,
    users: userReducer, // ← add this
  },
});
