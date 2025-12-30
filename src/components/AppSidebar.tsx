import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/store/auth";
import { CalendarHijri } from "./Calender";
import EventsSiderbar from "./EventsSiderbar";
import { ProfileCard } from "./ProfileCard";

export function AppSidebar() {
  
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup className="overflow-hidden bg-background ">
          <SidebarGroupLabel className="text-primary-800" style={{ direction: "ltr" }}>
            Perseon
          </SidebarGroupLabel>
          <SidebarGroupContent className="flex flex-col justify-between h-screen text-primary-800">
            <div>
              <div className="flex flex-col items-center justify-center">
                <CalendarHijri />
              </div>
              <EventsSiderbar />
            </div>

            <ProfileCard />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
