import { CalendarGrid } from "@/components/CalenderGrid";
import CalendarLayout from "@/components/layout/CalendarLayout";
import { createFileRoute } from "@tanstack/react-router";
import "../App.css";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <CalendarLayout>
      <CalendarGrid />
    </CalendarLayout>
  );
}
