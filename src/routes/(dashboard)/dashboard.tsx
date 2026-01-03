import DashboardLayout from "@/components/layout/DashboardLayout";
import { createFileRoute } from "@tanstack/react-router";
import { LayoutDashboard } from "lucide-react";

export const Route = createFileRoute("/(dashboard)/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <DashboardLayout>
      <main className="flex-1 overflow-y-auto p-8 mt-12 custom-scrollbar">
        <div className="max-w-5xl mx-auto">
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <LayoutDashboard size={20} /> صفحه ها
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TemplateCard title="Kanban Template" color="bg-blue-400" />
              <TemplateCard title="Daily Task Management" color="bg-green-800" />
              <TemplateCard title="Remote Team Hub" color="bg-yellow-700" />
            </div>
          </section>
        </div>
      </main>
    </DashboardLayout>
  );
}

const TemplateCard = ({ title, color }: { title: string; color: string }) => (
  <div
    className={`h-32 rounded-lg ${color} relative p-3 cursor-pointer hover:opacity-90 transition-opacity`}
  >
    <span className="bg-white/20 backdrop-blur-sm text-[10px] font-bold text-white px-2 py-0.5 rounded absolute top-3 right-3">
      TEMPLATE
    </span>
    <p className="absolute bottom-3 left-3 font-bold text-white leading-tight">{title}</p>
  </div>
);
