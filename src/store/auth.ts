import { api } from "@/api/axios";
import { getCookie } from "@/lib/utils";
import { setCookie } from "@/utils/cookie";
import { toast } from "sonner";
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
  login: (email: string, password: string) => Promise<{ message: string }>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  fetchProfile: () => Promise<User | void>;
  logout: () => void;
  cleanUp: () => void;
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
        const res = await api.post("/auth/login", { email, password });

        if (res.status >= 200 && res.status < 300) {
          setCookie("accessToken", res.data.data.accessToken);
          await get().fetchProfile();
          return { message: res.data.message };
        } else {
          toast.error(res.data.message);
          set({ user: null, isAuthenticated: false });
          return { message: res.data.message };
        }
      },
      signup: async (name, email, password) => {
        const res = await api.post("/auth/register", { name, email, password });

        if (res.status >= 200 && res.status < 300) {
          toast.success(res.data.message);
        } else {
          toast.error(res.data.message);
          set({ user: null, isAuthenticated: false });
        }
      },
      fetchProfile: async () => {
        const token = getCookie("accessToken");
        if (!token) return;

        const res = await api.get("/auth/profile");

        const user: User = await res.data;
        set({ user, isAuthenticated: true });
        return user;
      },
      logout: () => {
        document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        set({ user: null, isAuthenticated: false });
      },
      cleanUp: () => {
        document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie = "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        set({ user: null, isAuthenticated: false });
        window.location.href = "/login";
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ isAuthenticated: state.isAuthenticated, user: state.user }),
    },
  ),
);
