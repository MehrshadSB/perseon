import { create } from "zustand";
import { persist } from "zustand/middleware";

// تعریف نوع داده‌ها برای امنیت بیشتر
export type ViewMode = "dayGridMonth" | "timeGridWeek" | "timeGridDay";

interface CalendarState {
  viewMode: ViewMode;
  isSidebarOpen: boolean;
  selectedDate: string; // ISO String

  // تعریف توابع (Actions)
  setViewMode: (mode: ViewMode) => void;
  toggleSidebar: () => void;
  setSelectedDate: (date: Date) => void;
}

const useCalendarStore = create<CalendarState>()(
  persist(
    (set) => ({
      // مقادیر اولیه
      viewMode: "dayGridMonth",
      isSidebarOpen: true,
      selectedDate: new Date().toISOString(),

      // پیاده‌سازی اکشن‌ها
      setViewMode: (mode) => set({ viewMode: mode }),

      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

      setSelectedDate: (date) => set({ selectedDate: date.toISOString() }),
    }),
    {
      name: "calendar-storage", // نام کلید در LocalStorage
    },
  ),
);

export default useCalendarStore;
