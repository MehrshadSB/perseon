// hooks/useAuthUser.ts
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/axios";
import { useAuthStore, type User } from "@/store/auth";


export function useAuthUser() {
  const setUser = useAuthStore((s) => s.setUser);

  const query = useQuery<User>({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const res = await api.get<User>("/auth/me");
      return res.data;
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const { data, isError } = query;

  useEffect(() => {
    if (data) {
      setUser(data);
    }

    if (isError) {
      setUser(null);
    }
  }, [data, isError, setUser]);

  return query;
}
