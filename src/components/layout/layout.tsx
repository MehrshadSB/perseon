import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { getJalaliMonthYear } from "@/lib/generateMonthGrid";
import useCalendarStore from "@/store/calender";
import { AppSidebar } from "../AppSidebar";
import { ViewSwitcher } from "../ViewSwitcher";

export default function Layout({ children }: { children: React.ReactNode }) {
  const today = new Date();
  const viewMode = useCalendarStore((state) => state.viewMode);
  const setViewMode = useCalendarStore((state) => state.setViewMode);

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full relative">
        <div className="absolute flex items-center border-b border-gray-dark-200 h-14 w-full">
          <SidebarTrigger />
          <h1 className="text-xl font-bold px-2">{getJalaliMonthYear(today)}</h1>
          <ViewSwitcher />
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}
