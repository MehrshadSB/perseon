// hooks/useLogin.ts
import { useMutation } from "@tanstack/react-query";
import { api } from "@/api/axios";
import { useAuthStore, type User } from "@/store/auth";
import { setCookie } from "@/utils/cookie";


interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
}

export function useLogin() {
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: async ({ email, password }: LoginPayload) => {
      const res = await api.post<LoginResponse>("/auth/login", {
        email,
        password,
      });
      return res.data;
    },

    onSuccess: async ({ accessToken }) => {
      setCookie("accessToken", accessToken);

      const me = await api.get<User>("/auth/me");

      setUser(me.data);
    },
  });
}
