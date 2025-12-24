import { useAuthUser } from "@/hooks/useAuthUser";
import { type ReactNode } from "react";

function AuthProvider({ children }: { children: ReactNode }) {
  useAuthUser();
  return <>{children}</>;
}

export default AuthProvider;
