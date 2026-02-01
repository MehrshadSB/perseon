import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    redirect({ to: "/login" });
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <div></div>;
}
