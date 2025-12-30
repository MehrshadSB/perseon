import { useAuthStore } from "@/store/auth";
import { useEffect, type ReactNode } from "react";

function AuthProvider({ children }: { children: ReactNode }) {
  const fetchProfile = useAuthStore((s) => s.fetchProfile);

  useEffect(() => {
    const getProfile = async () => {
      await fetchProfile();
    };

    getProfile();
  }, [fetchProfile]);

  return <>{children}</>;
}

export default AuthProvider;
