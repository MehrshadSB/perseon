import {
  addDays,
  addMonths,
  addWeeks,
  startOfToday,
  subDays,
  subMonths,
  subWeeks,
} from "date-fns-jalali";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// تعریف نوع داده‌ها برای امنیت بیشتر
export type ViewMode = "dayGridMonth" | "timeGridWeek" | "timeGridDay";

interface CalendarState {
  viewMode: ViewMode;
  isSidebarOpen: boolean;
  selectedDate: string;
  viewDate: Date;
  direction: 0 | -1 | 1;
  setViewMode: (mode: ViewMode) => void;
  toggleSidebar: () => void;
  setSelectedDate: (date: Date) => void;
  setViewDate: (date: Date) => void;
  next: () => void;
  back: () => void;
  today: () => void;
}

const useCalendarStore = create<CalendarState>()(
  persist(
    (set) => ({
      viewMode: "dayGridMonth",
      isSidebarOpen: true,
      selectedDate: new Date().toISOString(),
      viewDate: new Date(),
      direction: 0,

      setViewMode: (mode) => set({ viewMode: mode }),
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setSelectedDate: (date) => set({ selectedDate: date.toISOString() }),
      setViewDate: (date) => set({ viewDate: date }),

      next: () =>
        set((state) => {
          const { viewDate, viewMode } = state;
          let nextDate;
          if (viewMode === "dayGridMonth") nextDate = addMonths(viewDate, 1);
          else if (viewMode === "timeGridWeek") nextDate = addWeeks(viewDate, 1);
          else nextDate = addDays(viewDate, 1);

          return {
            viewDate: nextDate,
            direction: 1, // همیشه برای بعدی ۱
          };
        }),

      back: () =>
        set((state) => {
          const { viewDate, viewMode } = state;
          let prevDate;
          if (viewMode === "dayGridMonth") prevDate = subMonths(viewDate, 1);
          else if (viewMode === "timeGridWeek") prevDate = subWeeks(viewDate, 1);
          else prevDate = subDays(viewDate, 1);

          return { viewDate: prevDate, direction: -1 };
        }),

      today: () => set({ viewDate: startOfToday() }),
    }),
    {
      name: "calendar-storage",
    },
  ),
);

export default useCalendarStore;
