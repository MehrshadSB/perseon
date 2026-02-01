import { CreatePageModal } from "@/components/CreatePageModal";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { usePages } from "@/hooks/usePages";
import { useAuthStore } from "@/store/auth";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { LayoutDashboard, Loader2, Plus } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/(dashboard)/dashboard")({
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState();
    console.log(isAuthenticated);

    if (!isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { data: pages, isLoading, error } = usePages();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  console.log(pages);

  return (
    <DashboardLayout>
      <main className="flex-1 overflow-y-auto p-8 mt-12 custom-scrollbar">
        <div className="max-w-5xl mx-auto">
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <LayoutDashboard size={20} /> صفحه ها
              </h2>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Plus size={16} />
                صفحه جدید
              </button>
            </div>

            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin" size={32} />
              </div>
            )}

            {error && (
              <div className="text-center py-12 text-destructive">خطا در بارگذاری صفحات</div>
            )}

            {pages && pages.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                هنوز صفحه‌ای ایجاد نشده است
              </div>
            )}

            {pages && pages.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {pages.map((page) => (
                  <TemplateCard
                    key={page.id}
                    pageId={page.pageId}
                    title={page.title}
                    color={page.color}
                    templateType={page.template.type}
                    itemCount={page._count}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <CreatePageModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} />
    </DashboardLayout>
  );
}

interface TemplateCardProps {
  pageId: string;
  title: string;
  color: string;
  templateType: "CALENDAR" | "BOARD";
  itemCount?: {
    events: number;
    tasks: number;
  };
}

const TemplateCard = ({ pageId, title, color, templateType, itemCount }: TemplateCardProps) => {
  const totalItems = (itemCount?.events || 0) + (itemCount?.tasks || 0);

  return (
    <Link to="/c/$pageId" params={{ pageId }}>
      <div
        className="h-32 rounded-lg relative p-3 cursor-pointer hover:opacity-90 transition-all hover:scale-[1.02]"
        style={{ backgroundColor: color }}
      >
        <span className="bg-white/20 backdrop-blur-sm text-[10px] font-bold text-white px-2 py-0.5 rounded absolute top-3 right-3">
          {templateType === "CALENDAR" ? "تقویم" : "بورد"}
        </span>

        {totalItems > 0 && (
          <span className="bg-white/30 backdrop-blur-sm text-xs text-white px-2 py-0.5 rounded absolute top-3 left-3">
            {totalItems} آیتم
          </span>
        )}

        <p className="absolute bottom-3 left-3 font-bold text-white leading-tight">{title}</p>
      </div>
    </Link>
  );
};
