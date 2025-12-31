import { CalendarGrid } from "@/components/CalenderGrid";
import CalendarLayout from "@/components/layout/CalendarLayout";
import { useAuthStore } from "@/store/auth";
import { createFileRoute, redirect } from "@tanstack/react-router";
import "../App.css";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState();
    console.log(isAuthenticated);
    
    if (!isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
  component: App,
});

function App() {
  return (
    <CalendarLayout>
      <CalendarGrid />
    </CalendarLayout>
  );
}
