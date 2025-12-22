import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { getJalaliMonthYear } from "@/lib/generateMonthGrid";
import useCalendarStore from "@/store/calender";
import { AppSidebar } from "../AppSidebar";
import { ViewSwitcher } from "../ViewSwitcher";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { viewDate } = useCalendarStore();

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full relative">
        <div className="absolute flex items-center border-b border-gray-dark-200 h-14 w-full">
          <SidebarTrigger size={"icon-lg"} />
          <h1 className="text-xl font-bold w-24 px-2">{getJalaliMonthYear(viewDate)}</h1>
          <ViewSwitcher />
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}
