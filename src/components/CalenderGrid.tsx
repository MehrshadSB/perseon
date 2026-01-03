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
import { createSnapModifier } from "@dnd-kit/modifiers";
import { eachDayOfInterval, endOfWeek, format, isSameDay, startOfWeek } from "date-fns-jalali";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { QuickEventModal } from "./QuickEventModal";
import { Badge } from "./ui/badge";
export const CalendarGrid = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ date: Date; y: number } | null>(null);
  const [dragEnd, setDragEnd] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalPos, setModalPos] = useState({ top: 0, left: 0 });
  const [selectedRange, setSelectedRange] = useState({ start: new Date(), end: new Date() });

  const snapToInterval = (y: number) => Math.round(y / 12) * 12;

  const handleGridMouseDown = (e: React.MouseEvent, dayDate: Date) => {
    if ((e.target as HTMLElement).closest(".draggable-event")) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const relativeY = snapToInterval(e.clientY - rect.top);

    setIsDragging(true);
    setDragStart({ date: dayDate, y: relativeY });

    // محاسبه ساعت دقیق نقطه کلیک شده
    const currentHourMin = (relativeY / 48) * 60;
    const start = new Date(dayDate);
    start.setHours(Math.floor(currentHourMin / 60), currentHourMin % 60);

    // تعیین پایان (مثلاً ۱۵ یا ۳۰ دقیقه بعد به عنوان پیش‌فرض)
    const end = new Date(start);
    end.setMinutes(start.getMinutes() + 15);

    setDragEnd(relativeY + 12); // نمایش بصری ۱۵ دقیقه (هر ۴۸ پیکسل ۱ ساعت است، پس ۱۲ پیکسل ۱۵ دقیقه)

    // آپدیت کردن استیت اصلی برای مودال
    setSelectedRange({ start, end });
  };

  const handleGridMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !dragStart) return;

    const container = e.currentTarget.querySelector(
      `[data-date="${format(dragStart.date, "yyyy-MM-dd")}"]`,
    );
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const currentY = snapToInterval(e.clientY - rect.top);

    if (currentY > dragStart.y) {
      setDragEnd(currentY);

      // آپدیت لحظه‌ای زمان پایان برای نمایش در Ghost Event یا مودال
      const endMin = (currentY / 48) * 60;
      const newEnd = new Date(dragStart.date);
      newEnd.setHours(Math.floor(endMin / 60), endMin % 60);

      setSelectedRange((prev) => ({ ...prev, end: newEnd }));
    }
  };

  const handleGridMouseUp = (e: React.MouseEvent) => {
    if (isDragging && dragStart && dragEnd) {
      // ۱. پیدا کردن ستون دقیق
      const container = e.currentTarget.querySelector(
        `[data-date="${format(dragStart.date, "yyyy-MM-dd")}"]`,
      );

      if (container) {
        const rect = container.getBoundingClientRect();
        const modalWidth = 420;

        // ۲. محاسبه موقعیت افقی (RTL)
        // اگر سمت چپ ستون جا بود، آنجا باز شود، وگرنه سمت راست
        let leftPos = rect.left - modalWidth - 15;
        if (leftPos < 20) {
          leftPos = rect.right + 15;
        }

        // ۳. محاسبه موقعیت عمودی (تراز با شروع درگ)
        const topPos = Math.min(rect.top + dragStart.y, window.innerHeight - 450);

        setModalPos({ top: topPos, left: leftPos });

        // تنظیم زمان‌های نهایی
        const startMin = (dragStart.y / 48) * 60;
        const endMin = (dragEnd / 48) * 60;
        const start = new Date(dragStart.date);
        start.setHours(Math.floor(startMin / 60), startMin % 60);
        const end = new Date(dragStart.date);
        end.setHours(Math.floor(endMin / 60), endMin % 60);

        setSelectedRange({ start, end });
        setShowModal(true);
      }
    }
    setIsDragging(false);
  };

  useEffect(() => {
    if (showModal && selectedRange) {
      const startY =
        selectedRange.start.getHours() * 48 + (selectedRange.start.getMinutes() / 60) * 48;
      const endY = selectedRange.end.getHours() * 48 + (selectedRange.end.getMinutes() / 60) * 48;

      setDragStart((prev) => (prev ? { ...prev, y: startY } : null));
      setDragEnd(endY);
    }
  }, [selectedRange, showModal]);

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

    const draggedEvent = active.data.current?.event;
    const overId = over.id.toString();

    // اگر در نمای ماه هستیم (فقط تغییر روز)
    if (viewMode === "dayGridMonth") {
      const newDate = new Date(overId); // overId در اینجا "yyyy-MM-dd" است
      const updatedStart = new Date(
        newDate.setHours(draggedEvent.start.getHours(), draggedEvent.start.getMinutes()),
      );
      const updatedEnd = new Date(
        newDate.setHours(draggedEvent.end.getHours(), draggedEvent.end.getMinutes()),
      );
    }

    // اگر در نمای هفته/روز هستیم (تغییر ساعت و احتمالاً روز)
    else if (overId.includes("-hour-")) {
      const [datePart, hourPart] = overId.split("-hour-");
      const newDate = new Date(datePart);
      const newHour = parseInt(hourPart);

      const duration = draggedEvent.end.getTime() - draggedEvent.start.getTime();
      const updatedStart = new Date(newDate.setHours(newHour, 0, 0, 0));
      const updatedEnd = new Date(updatedStart.getTime() + duration);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  const snapTo15Min = createSnapModifier(12);

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
              key={viewDate.toString()}
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
                        <div key={i} className="h-12 border-b border-l relative">
                          {/* hour column from 00:00 to 23:00 */}
                          <span className="absolute -top-2  left-0 right-0 text-center text-[10px] text-gray-400 bg-background w-1/2 mx-auto">
                            {i}:00
                          </span>
                        </div>
                      ))}
                    </div>
                    <div
                      className={`grid ${viewMode === "timeGridDay" ? "grid-cols-1" : "grid-cols-7"} flex-1 relative`}
                      onMouseMove={handleGridMouseMove}
                      onMouseUp={handleGridMouseUp}
                      onMouseLeave={handleGridMouseUp} // if mouse leave calendar drag will end
                    >
                      {currentWeekDays
                        .filter((date) =>
                          viewMode === "timeGridDay" ? isSameDay(date, viewDate) : true,
                        )
                        .map((dayDate, dayIndex) => (
                          <div
                            key={dayIndex}
                            data-date={format(dayDate, "yyyy-MM-dd")}
                            className="relative flex flex-col border-l last:border-l-0 h-288 select-none touch-none"
                            onMouseDown={(e) => handleGridMouseDown(e, dayDate)}
                          >
                            {/* hour bottom border */}
                            {Array.from({ length: 24 }).map((_, hourIndex) => (
                              <div
                                key={hourIndex}
                                className="h-12 border-b border-gray-200/50 pointer-events-none"
                              />
                            ))}

                            {/* Temp Ghost Event */}
                            {(isDragging || showModal) &&
                              dragStart &&
                              isSameDay(dragStart.date, dayDate) &&
                              dragEnd && (
                                <div
                                  className="absolute left-0 right-0 mx-1 bg-blue-500/20 border-r-4 border-blue-600 z-20 pointer-events-none transition-all"
                                  style={{
                                    top: `${dragStart.y}px`,
                                    height: `${dragEnd - dragStart.y}px`,
                                  }}
                                >
                                  <div className="bg-blue-600 text-white text-[10px] px-1 shadow-sm w-fit rounded-bl-md">
                                    {format(selectedRange.end, "HH:mm") +
                                      " - " +
                                      format(selectedRange.start, "HH:mm")}
                                  </div>
                                </div>
                              )}
                            {/* Events should map here */}
                            <div className="absolute inset-0 pointer-events-none">
                              {events
                                .filter((event) => isSameDay(new Date(event.start), dayDate))
                                .map((event) => (
                                  <div
                                    key={event.id}
                                    className="draggable-event pointer-events-auto"
                                  >
                                    <TimeGridEvent event={event} />
                                  </div>
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
        <QuickEventModal
          showModal={showModal}
          setShowModal={(val) => {
            setShowModal(val);
            if (!val) {
              setDragStart(null);
              setDragEnd(null);
            } // پاک کردن مستطیل آبی بعد از بستن
          }}
          modalPos={modalPos}
          selectedRange={selectedRange}
          setSelectedRange={setSelectedRange}
          onSave={(data) => {
            console.log("Saving to DB:", data);
            // اینجا اکشن ذخیره در دیتابیس را صدا بزن
            setShowModal(false);
            setDragStart(null);
            setDragEnd(null);
          }}
        />
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
      className="left-3 right-0 bg-blue-600/90 text-white p-1 text-[10px] rounded shadow-sm touch-none pointer-events-auto overflow-hidden"
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
      className={`h-12 border-b border-gray-300/80 relative ${isOver ? "bg-blue-50/50" : ""}`}
    >
      {children}
    </div>
  );
};
