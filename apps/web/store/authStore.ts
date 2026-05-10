"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";
import { User, AuthTokens } from "@/types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, tokens: AuthTokens) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      setAuth: (user, tokens) => {
        // Store tokens in cookies (15min for access, 7d for refresh)
        Cookies.set("accessToken", tokens.accessToken, { expires: 1 / 96, secure: false, sameSite: "lax" });
        Cookies.set("refreshToken", tokens.refreshToken, { expires: 7, secure: false, sameSite: "lax" });
        set({ user, isAuthenticated: true, isLoading: false });
      },

      clearAuth: () => {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        set({ user: null, isAuthenticated: false, isLoading: false });
      },

      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: "smartattendance-auth",
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
