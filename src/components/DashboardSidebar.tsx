import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { Accordion, AccordionItem } from "@radix-ui/react-accordion";
import { Calendar, Home, LayoutDashboard, Plus, Settings } from "lucide-react";
import { SwitchMode } from "./SwitchTheme";
import { AccordionContent, AccordionTrigger } from "./ui/accordion";
function DashboardSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup className="overflow-hidden bg-background ">
          <SidebarGroupLabel className="text-primary-800" style={{ direction: "ltr" }}>
            Perseon
          </SidebarGroupLabel>
          <SidebarGroupContent className="flex flex-col justify-between h-screen text-primary-800">
            <div>
              <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#2c333a] cursor-pointer transition-colors">
                <Home size={18} />
                <span className="text-sm">خانه</span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2 rounded-md bg-[#2c333a] text-[#579dff] cursor-pointer">
                <LayoutDashboard size={18} />
                <span className="text-sm font-medium">صفحه های من</span>
              </div>

              <div className="pt-6 pb-2 px-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#8c9bab]">
                  کارگاه
                </p>
              </div>

              <div className="space-y-1">
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1" className="border-none">
                    <AccordionTrigger className="flex items-center  hover:no-underline py-0">
                      <div className="flex items-center justify-between w-full px-3 py-2 hover:bg-[#2c333a]  rounded-md transition-colors group">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 bg-emerald-600 rounded flex items-center justify-center text-white text-[10px] font-bold">
                            P
                          </div>
                          <span className="text-sm text-[#9fadbc]">کارگاه پرسِون</span>
                        </div>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                      <div className="pl-10 space-y-1 pt-1 pb-2">
                        <div className="flex items-center gap-3 py-2 text-sm text-[#9fadbc] hover:text-white cursor-pointer transition-colors">
                          <LayoutDashboard size={14} />
                          <span>تخته های من</span>
                          <Plus size={14} className="ml-auto opacity-0 group-hover:opacity-100" />
                        </div>
                        <div className="flex items-center gap-3 py-2 text-sm text-[#9fadbc] hover:text-white cursor-pointer transition-colors">
                          <Calendar size={14} />
                          <span>تقویم های من</span>
                          <Plus size={14} className="ml-auto opacity-0 group-hover:opacity-100" />
                        </div>
                        <div className="flex items-center gap-3 py-2 text-sm text-[#9fadbc] hover:text-white cursor-pointer transition-colors">
                          <Settings size={14} />
                          <span>تنظیمات</span>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
            <div className="m-4 p-4 rounded-lg bg-linear-to-br  from-[#282e33] to-[#1d2125] border border-[#38414a]">
              <SwitchMode />
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default DashboardSidebar;
