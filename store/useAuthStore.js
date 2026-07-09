import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  setAuth: (user, tokens) => set({
    user,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  }),
  clearAuth: () => set({
    user: null,
    accessToken: null,
    refreshToken: null,
  }),
}));
