import { generateMonthGrid, getJalaliMonthYear } from "@/lib/generateMonthGrid";
import { isSameDay } from "date-fns";
import { useState } from "react";
import { Badge } from "./ui/badge";

type ViewMode = "month" | "week";

export const CalendarGrid = () => {
  const [view, setView] = useState<ViewMode>("month");
  const [currentDate, setCurrentDay] = useState<Date>(new Date());
  // Placeholder data - in a real app, use 'date-fns' or 'dayjs'
  const daysOfWeek = ["شنبه", "یکشنبه", "دوشنبه", "سه شنبه", "چهارشنبه", "پنجشنبه", "جمعه"];
  const weekDays = Array.from({ length: 7 }, (_, i) => i + 10); // One week slice
  const days = generateMonthGrid(currentDate);
  console.log(days);

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden bg-white">
      {/* Header / Controls */}
      <div className="flex items-center justify-between p-4">
        <h1 className="text-xl font-bold">{getJalaliMonthYear(currentDate)}</h1>
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setView("month")}
            className={`px-4 py-1 rounded ${view === "month" ? "bg-white shadow-sm" : ""}`}
          >
            ماه
          </button>
          <button
            onClick={() => setView("week")}
            className={`px-4 py-1 rounded ${view === "week" ? "bg-white shadow-sm" : ""}`}
          >
            هفته
          </button>
        </div>
      </div>

      {/* Day Labels */}
      <div className="grid grid-cols-7 bg-gray-50">
        {daysOfWeek.map((day) => (
          <div key={day} className="py-2 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="flex-1">
        {view === "month" ? (
          <div className="flex-1 grid grid-cols-7 grid-rows-5 h-full gap-1 p-1 bg-gray-200">
            {days.map((day, index) => (
              <div
                key={index}
                className={` flex flex-col items-start bg-primary-100  rounded-lg p-2 h-full transition-all  hover:bg-primary-200
        `}
              >
                <div className="flex justify-end">
                  <Badge
                    variant="default"
                    className={`${isSameDay(day.date, new Date()) ? "font-bold bg-blue-300" : ""}`}
                  >
                    {day.dayNumber}
                  </Badge>
                </div>

                {/* محتوای داخلی روز (مثل رویدادها) */}
                <div className="flex-1 overflow-y-auto mt-1">{/* Events go here */}</div>
              </div>
            ))}
          </div>
        ) : (
          /* Weekly View (Time-based Grid) */
          <div className="flex">
            {/* Time Column */}
            <div className="w-16  grid-cols-1 flex flex-col bg-gray-50">
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="h-10 border-t text-[10px] text-gray-400 text-center pt-1">
                  {i + 1}:00
                </div>
              ))}
            </div>
            {/* Days Columns */}
            <div className="grid grid-cols-7 flex-1">
              {weekDays.map((day) => (
                <div key={day} className=" relative group hover:bg-gray-50/50">
                  {Array.from({ length: 77 }).map((_, i) => (
                    <div key={i} className="h-20 border-t border-gray-100" />
                  ))}
                  {/* Sample Floating Event */}
                  {day === 12 && (
                    <div className="absolute top-40 left-1 right-1 bg-green-500 text-white text-xs p-2 rounded shadow-md z-10">
                      Project Launch
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
