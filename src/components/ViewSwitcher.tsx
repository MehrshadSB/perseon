import useCalendarStore from "@/store/calender";
import { ArrowLeft, ArrowRight, Calendar, Check, ChevronDown, Columns, Layout } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

export const ViewSwitcher: React.FC = () => {
  const { viewMode, setViewMode, today, back, next } = useCalendarStore();
  const [isOpen, setIsOpen] = useState(false);
  const modes = [
    { id: "dayGridMonth", label: "نمای ماه", icon: Calendar },
    { id: "timeGridWeek", label: "نمای هفته", icon: Columns },
    { id: "timeGridDay", label: "نمای روز", icon: Layout },
  ] as const;
  const currentMode = modes.find((m) => m.id === viewMode) || modes[0];
  return (
    <div className="w-full">
      <div className="flex justify-between gap-1 p-1">
        <div className="flex relative text-right">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 py-2 rounded-xl hover:bg-gray-50 transition-all active:scale-95 justify-between"
          >
            <div className="flex items-center gap-2 text-gray-700 font-medium text-sm">
              <currentMode.icon size={16} className="text-blue-500" />
              <span>{currentMode.label}</span>
            </div>
            <ChevronDown
              size={16}
              className={`text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
              <div className="absolute right-0 mt-12 w-48 card rounded-2xl z-20 overflow-hidden p-1.5 animate-in fade-in zoom-in duration-150">
                {modes.map((mode) => {
                  const isActive = viewMode === mode.id;
                  return (
                    <button
                      key={mode.id}
                      onClick={() => {
                        setViewMode(mode.id);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-colors ${
                        isActive ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <mode.icon
                          size={18}
                          className={isActive ? "text-blue-600" : "text-gray-400"}
                        />
                        <span className="font-medium">{mode.label}</span>
                      </div>
                      {isActive && <Check size={14} strokeWidth={3} />}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        <div className="flex items-center">
          <Button className=" bg-gray-200! rounded-full! w-12 h-12" onClick={today}>
            امروز
          </Button>

          <button
            className="px-4 py-1.5 text-sm font-medium transition-all duration-200 rounded-md"
            onClick={back}
          >
            <ArrowRight size="16px" />
          </button>
          <button
            className="px-4 py-1.5 text-sm font-medium transition-all duration-200 rounded-md"
            onClick={next}
          >
            <ArrowLeft size="16px" />
          </button>
        </div>
      </div>
    </div>
  );
};
