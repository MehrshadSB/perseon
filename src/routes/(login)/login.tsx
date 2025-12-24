import { useAuthStore } from "@/store/auth";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(login)/login")({
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState();

    if (isAuthenticated) {
      throw redirect({ to: "/" });
    }
  },
  component: login,
});

function login() {
  return <div>LoginPage</div>;
}

export default login;
