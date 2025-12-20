import AutoCalendar from "@/components/AutoCalendar";
import { createFileRoute } from "@tanstack/react-router";
import "../App.css";
import { CalendarGrid } from "@/components/CalenderGrid";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return <CalendarGrid />;
}
