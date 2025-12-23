import { generateMonthGrid } from "@/lib/generateMonthGrid";
import { generateDummyEvents } from "@/lib/utils";
import useCalendarStore from "@/store/calender";
import {
  DndContext,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { eachDayOfInterval, endOfWeek, format, isSameDay, startOfWeek } from "date-fns-jalali";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Badge } from "./ui/badge";
export const CalendarGrid = () => {
  const [events, setEvents] = useState(generateDummyEvents());
  const viewMode = useCalendarStore((state) => state.viewMode);
  const viewDate = useCalendarStore((state) => state.viewDate);
  const direction = useCalendarStore((state) => state.direction);

  const days = generateMonthGrid(viewDate);

  const currentWeekDays = eachDayOfInterval({
    start: startOfWeek(viewDate, { weekStartsOn: 6 }), // شروع از شنبه
    end: endOfWeek(viewDate, { weekStartsOn: 6 }),
  });

  const handleDragEnd = async (event: DragEndEvent) => {
    const { over, active } = event;

    if (!over) return;

    const eventId = active.id.toString().replace("ev-", "");
    const newDateId = over.id as string;
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id.toString() === eventId) {
          // تبدیل رشته تاریخ به آبجکت Date معتبر
          // اگر از date-fns-jalali استفاده می‌کنید، مطمئن شوید پارس کردن درست انجام شود
          const updatedDate = new Date(newDateId);

          return { ...ev, date: updatedDate };
        }
        return ev;
      }),
    );

    try {
      console.log("بک‌اِند با موفقیت آپدیت شد!");
    } catch (error) {
      console.error("خطا در آپدیت بک‌اِند");
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  const variants = {
    initial: (direction: number) => ({
      x: direction > 0 ? -75 : 75,
      opacity: 0.8,
    }),
    animate: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? 75 : -75,
      opacity: 0,
    }),
  };
  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex flex-col w-full h-screen pt-14 overflow-hidden">
        <div className="flex w-full border-b">
          {viewMode === "timeGridWeek" ? <div className="w-16 border-l" /> : null}
          <div className="grid grid-cols-7 flex-1">
            {currentWeekDays.map((date, index) => {
              const isToday = isSameDay(date, new Date());
              const dayName = format(date, "EEEE"); // شنبه، یکشنبه...
              const dayNumber = format(date, "d"); // ۱، ۲، ۳...

              return (
                <div
                  key={index}
                  className="flex flex-col items-center py-3 gap-1 border-l last:border-l-0"
                >
                  <span
                    className={`text-[11px] font-medium ${isToday ? "text-blue-600" : "text-gray-500"}`}
                  >
                    {dayName}
                  </span>
                  {viewMode === "timeGridWeek" ? (
                    <div
                      className={`
            text-xl w-9 h-9 flex items-center justify-center rounded-full transition-colors
            ${isToday ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100 cursor-pointer"}
          `}
                    >
                      {dayNumber}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
        {/* Main Grid Month View */}
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={viewDate.toString()} // کلید منحصر به فرد برای هر تغییر تاریخ
              custom={direction}
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full h-full"
            >
              <div className="flex-1 h-full overflow-y-auto calendar-scroll">
                {viewMode === "dayGridMonth" ? (
                  <div className="flex-1 grid grid-cols-7 grid-rows-5 h-full">
                    {days.map((day, index) => (
                      <DayCell key={index} day={day}>
                        {events
                          .filter((ev) => isSameDay(ev.date, day.date))
                          .map((ev) => (
                            <DraggableEvent key={ev.id} event={ev} />
                          ))}
                      </DayCell>
                    ))}
                  </div>
                ) : (
                  <div className="flex">
                    <div className="w-16 grid-cols-1 flex flex-col bg-background">
                      {Array.from({ length: 24 }).map((_, i) => (
                        <div
                          key={i}
                          className="border-b flex items-center  justify-center h-8 text-[10px] text-gray-400 text-center"
                        >
                          {i + 1}:00
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-1 flex-1">
                      {Array.from({ length: 24 }).map((_, i) => (
                        <div
                          key={i}
                          className="border-b border-l flex items-center justify-center text-[10px] text-gray-400 text-center"
                        ></div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </DndContext>
  );
};

// --- کامپوننت Draggable (رویداد) ---
const DraggableEvent = ({ event }: { event: any }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `ev-${event.id}`, // یک آیدی یونیک
    data: { event },
  });

  const style: React.CSSProperties = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
    position: "relative",
    zIndex: isDragging ? 999 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-blue-600 text-white text-[8px] py-0.5 px-2 mb-1 rounded-md shadow-sm touch-none"
    >
      {event.title}
    </div>
  );
};

const DayCell = ({ day, children }: { day: any; children: React.ReactNode }) => {
  const dateKey = format(day.date, "yyyy-MM-dd");
  const { setNodeRef, isOver } = useDroppable({
    id: dateKey,
  });

  const isFirstDayOfMonth = day.dayNumber === 1 || day.dayNumber === "1";

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col items-start p-2 border-b border-l transition-all
        ${isOver ? "bg-blue-100/50 scale-[0.98]" : "hover:bg-slate-50"}`}
    >
      <div className="flex justify-between items-center w-full mb-1">
        <div className="text-xs font-bold text-slate-500">
          {isFirstDayOfMonth && format(day.date, "MMMM")}
        </div>

        <Badge
          variant="secondary"
          className={`h-6 w-6 flex items-center justify-center p-0 ${
            isSameDay(day.date, new Date()) ? "bg-blue-600 text-white" : ""
          }`}
        >
          {day.dayNumber}
        </Badge>
      </div>
      <div className="w-full flex-1">{children}</div>
    </div>
  );
};
