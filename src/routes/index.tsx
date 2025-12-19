import { CalendarGrid } from "@/components/CalenderGrid";
import { createFileRoute } from "@tanstack/react-router";
import "../App.css";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return <CalendarGrid />;
}
