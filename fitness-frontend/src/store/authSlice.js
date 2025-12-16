import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null,
    token: localStorage.getItem("token") || null,
    userId: localStorage.getItem("userId") || null,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.userId = action.payload.user?.sub || null;
      state.token = action.payload.token;

      // Store values as strings. Use JSON.stringify for objects and
      // store the token from the action payload (not from user object).
      try {
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      } catch (e) {
        // Fallback: store a minimal string if serialization fails
        localStorage.setItem("user", String(action.payload.user));
      }
      if (action.payload.user?.sub) {
        localStorage.setItem("userId", action.payload.user.sub);
      }
      if (action.payload.token) {
        localStorage.setItem("token", action.payload.token);
      }
    },
    logout: (state) => {
      state.user = null;
      state.userId = null;
      state.token = null;

      localStorage.removeItem("user");
      localStorage.removeItem("userId");
      localStorage.removeItem("token");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
