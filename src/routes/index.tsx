import { StackCard } from "@/components/StackCard";
import { SwitchMode } from "@/components/SwitchTheme";
import TechBadge from "@/components/TechBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import { Database, Laptop, RouteIcon, Zap } from "lucide-react";
import "../App.css";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <div className="min-h-screen flex-col bg-primary-50 justify-between text-primary-900 flex selection:bg-primary/10">
      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 pt-24 pb-16 text-center">
        <Badge variant="outline" className="mb-4 px-4 py-1 border-primary/80 text-secondary-600">
          v1.0.0 Ready for Production
        </Badge>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-linear-to-b from-secondary-400 to-primary-600/80 bg-clip-text text-transparent">
          The Type-Safe <br /> Boilerplate.
        </h1>

        <p className="text-xl text-primary-900 max-w-2xl mx-auto mb-10 leading-relaxed">
          A high-performance foundation built with the modern web's best tools. Synchronized server
          state, typesafe routing, and effortless UI.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <Button size="lg" className="rounded-full px-8 gap-2">
            Get Started <Zap className="w-4 h-4 fill-current" />
          </Button>
          <Button size="lg" variant="outline" className="rounded-full px-8">
            View Docs
          </Button>
          <SwitchMode />
        </div>

        {/* Stack Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
          <StackCard
            title="TanStack Query"
            desc="Powerful asynchronous state management and data fetching."
            icon={<Database className="w-6 h-6" />}
          />
          <StackCard
            title="TanStack Router"
            desc="100% typesafe routing with nested layouts and loaders."
            icon={<RouteIcon className="w-6 h-6" />}
          />
          <StackCard
            title="Zustand"
            desc="Small, fast, and scalable barebones state management."
            icon={<Zap className="w-6 h-6" />}
          />
          <StackCard
            title="Shadcn + Tailwind"
            desc="Beautifully designed components that you own."
            icon={<Laptop className="w-6 h-6" />}
          />
        </div>
      </main>

      {/* Tech Footer */}
      <footer className="border-t border-secondary-500 shadow-teal-400 shadow-2xl mt-12 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-center gap-6 opacity-70">
          <TechBadge icon={Database}>Server State</TechBadge>
          <TechBadge icon={RouteIcon}>Typesafe Navigation</TechBadge>
          <TechBadge icon={Zap}>Client Store</TechBadge>
          <TechBadge icon={Laptop}>Utility-First CSS</TechBadge>
        </div>
      </footer>
    </div>
  );
}
