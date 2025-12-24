// api/auth.api.ts
import { queryClient } from "@/lib/queryClient";
import { type User } from "@/store/auth";
import { removeCookie } from "@/utils/cookie";
import { api } from "./axios";

export async function loginApi(email: string, password: string) {
  const res = await api.post("/auth/login", { email, password });
  return res.data; // { accessToken }
}

export async function fetchMe(): Promise<User> {
  const res = await api.get("/auth/me");
  return res.data;
}

export async function logoutApi() {
  try {
    await api.post("/auth/logout");
  } finally {
    removeCookie("accessToken");
    queryClient.clear();
  }
}
