import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuthStore } from "@/store/auth";
import { Bell, HelpCircle } from "lucide-react";
import DashboardSidebar from "../DashboardSidebar";
import { Avatar, AvatarFallback } from "../ui/avatar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((profile) => profile.user);

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <main className="w-full relative">
        <div className="absolute flex items-center px-6 justify-between border-b border-gray-dark-200 h-14 w-full">
          <div></div>
          <div className="flex items-center gap-3">
            <Bell size={20} className="hover:text-white cursor-pointer" />
            <HelpCircle size={20} className="hover:text-white cursor-pointer" />
            <Avatar>
              <AvatarFallback>{user?.data?.name?.slice(0, 1) || ""}</AvatarFallback>
            </Avatar>
          </div>
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}
