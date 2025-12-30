import { api } from "@/api/axios";
import { getCookie } from "@/lib/utils";
import { setCookie } from "@/utils/cookie";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Role {
  id: string;
  name: string;
}

export interface User {
  data: {
    id: string;
    name: string | null;
    email: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
  message: string | number | null;
  success: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (
    name: string,
    email: string,
    password: string,
  ) => Promise<{ message: string; userId: string }>;
  fetchProfile: () => Promise<User>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: Boolean(user),
        }),

      login: async (email, password) => {
        const postLogin = async (email: string, password: string) => {
          const res = await api.post("/auth/login", { email, password });

          return res.data;
        };

        const user = await postLogin(email, password);

        setCookie("accessToken", user.data.accessToken);

        await get().fetchProfile();

        if (user.success) return true;

        return false;
      },
      signup: async (name, email, password) => {
        const postSignup = async (name: string, email: string, password: string) => {
          const res = await api.post("/auth/register", { name, email, password });

          return res.data;
        };

        const resp = await postSignup(name, email, password);
        return resp.data;
      },
      fetchProfile: async () => {
        const token = getCookie("accessToken");
        if (!token) throw new Error("No access token found in cookie");

        const res = await api.get("/auth/profile");

        const user: User = await res.data;
        set({ user, isAuthenticated: true });
        return user;
      },
      logout: () => {
        document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ isAuthenticated: state.isAuthenticated, user: state.user }),
    },
  ),
);
