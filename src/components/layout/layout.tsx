import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { getCalendarRangeTitle } from "@/lib/generateMonthGrid";
import useCalendarStore from "@/store/calender";
import { AppSidebar } from "../AppSidebar";
import { ViewSwitcher } from "../ViewSwitcher";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { viewDate, viewMode } = useCalendarStore();

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full relative">
        <div className="absolute flex items-center border-b border-gray-dark-200 h-14 w-full">
          <div className="flex items-center w-42">
            <SidebarTrigger size={"icon-lg"} />
            <h1 className="text-xl w-full text-center font-bold">
              {getCalendarRangeTitle(viewDate, viewMode)}
            </h1>
          </div>
          <ViewSwitcher />
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}
