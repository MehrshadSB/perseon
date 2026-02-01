import { useAuthStore } from "@/store/auth";
import { useEffect, type ReactNode } from "react";

function AuthProvider({ children }: { children: ReactNode }) {
  const { fetchProfile, isAuthenticated } = useAuthStore((s) => s);

  useEffect(() => {
    
    const getProfile = async () => {
      await fetchProfile();
    };

    getProfile();
  }, [fetchProfile]);

  return <>{children}</>;
}

export default AuthProvider;
