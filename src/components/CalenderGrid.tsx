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

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    if (!over) return;

    const eventId = active.id.toString().replace("ev-", "");
    const overId = over.id.toString(); // "yyyy-MM-dd" یا "yyyy-MM-dd-HH"

    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id.toString() === eventId) {
          if (overId.includes("-hour-")) {
            // منطق نمای هفته/روز
            const [datePart, hourPart] = overId.split("-hour-");
            const newStart = new Date(datePart);
            newStart.setHours(parseInt(hourPart), new Date(ev.start).getMinutes());

            const duration = new Date(ev.end).getTime() - new Date(ev.start).getTime();
            const newEnd = new Date(newStart.getTime() + duration);

            return { ...ev, start: newStart, end: newEnd };
          } else {
            // منطق نمای ماه
            const updatedDate = new Date(overId);
            // آپدیت کردن سال/ماه/روز بدون تغییر ساعت قبلی
            const newStart = new Date(ev.start);
            newStart.setFullYear(
              updatedDate.getFullYear(),
              updatedDate.getMonth(),
              updatedDate.getDate(),
            );
            return { ...ev, start: newStart };
          }
        }
        return ev;
      }),
    );
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

  console.log(days);

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex flex-col w-full h-screen pt-14 overflow-hidden">
        <div className="flex w-full border-b ">
          {viewMode === "timeGridWeek" ? <div className="w-16 border-l" /> : null}
          <div
            className={`grid flex-1 ${viewMode === "timeGridDay" ? "grid-cols-1" : "grid-cols-7"}`}
          >
            {currentWeekDays
              // اگر در نمای روزانه هستیم، فقط روزی را نشان بده که با تاریخ انتخاب شده برابر است
              .filter((date) => (viewMode === "timeGridDay" ? isSameDay(date, viewDate) : true))
              .map((date, index) => {
                const isToday = isSameDay(date, new Date());
                const dayName = format(date, "EEEE");
                const dayNumber = format(date, "d");

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

                    {/* نمایش عدد روز در نمای هفته و روز */}
                    {viewMode !== "dayGridMonth" ? (
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
              <div className="flex-1 h-full overflow-y-auto scrollbar-hide">
                {viewMode === "dayGridMonth" ? (
                  <div className="flex-1 grid grid-cols-7 grid-rows-5 h-full">
                    {days.map((day, index) => (
                      <DayCell key={index} day={day}>
                        {events
                          .filter((ev) => isSameDay(ev.start, day.date))
                          .map((ev) => (
                            <DraggableEvent key={ev.id} event={ev} />
                          ))}
                      </DayCell>
                    ))}
                  </div>
                ) : (
                  <div className="flex">
                    <div className="w-16 flex-none bg-background">
                      {Array.from({ length: 24 }).map((_, i) => (
                        <div key={i} className="h-9 border-b border-l relative">
                          {/* نمایش از ساعت 0:00 تا 23:00 */}
                          <span className="absolute -top-2  left-0 right-0 text-center text-[10px] text-gray-400 bg-background w-1/2 mx-auto">
                            {i}:00
                          </span>
                        </div>
                      ))}
                    </div>
                    <div
                      className={`grid ${viewMode === "timeGridDay" ? "grid-cols-1" : "grid-cols-7"} flex-1`}
                    >
                      {currentWeekDays
                        .filter((date) =>
                          viewMode === "timeGridDay" ? isSameDay(date, viewDate) : true,
                        )
                        .map((dayDate, dayIndex) => (
                          <div
                            key={dayIndex}
                            className="relative flex flex-col border-l last:border-r h-full" // 24 * 48px (h-12)
                          >
                            {/* ۱. خطوط راهنمای ساعت (Grid Lines) */}
                            {Array.from({ length: 24 }).map((_, hourIndex) => (
                              <HourSlot key={hourIndex} dayDate={dayDate} hour={hourIndex} />
                            ))}

                            {/* ۲. کانتینر ایونت‌ها (آماده برای پوزیشن Absolute) */}
                            <div className="absolute inset-0 pointer-events-none">
                              {events
                                .filter((event) => isSameDay(new Date(event.start), dayDate))
                                .map((event) => (
                                  <TimeGridEvent key={event.id} event={event} />
                                ))}
                            </div>
                          </div>
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

const TimeGridEvent = ({ event }: { event: any }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `ev-${event.id}`,
    data: { event },
  });

  const start = new Date(event.start);
  const end = new Date(event.end);
  const top = start.getHours() * 36 + (start.getMinutes() / 60) * 36;
  const height = ((end.getTime() - start.getTime()) / (1000 * 60 * 60)) * 36;

  const style: React.CSSProperties = {
    top: `${top}px`,
    height: `${height}px`,
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 100 : 10,
    position: "absolute",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="left-1 right-1 bg-blue-600/90 text-white p-1 text-[10px] rounded shadow-sm touch-none pointer-events-auto overflow-hidden"
    >
      <div className="font-bold">{event.title}</div>
      <div>{format(start, "HH:mm")}</div>
      <div>{format(end, "HH:mm")}</div>
    </div>
  );
};

const HourSlot = ({
  dayDate,
  hour,
  children,
}: {
  dayDate: Date;
  hour: number;
  children?: React.ReactNode;
}) => {
  const slotId = `${format(dayDate, "yyyy-MM-dd")}-hour-${hour}`;
  const { setNodeRef, isOver } = useDroppable({ id: slotId });

  return (
    <div
      ref={setNodeRef}
      className={`h-12 border-b border-gray-100/50 relative ${isOver ? "bg-blue-50/50" : ""}`}
    >
      {children}
    </div>
  );
};
