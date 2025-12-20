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
import { format, isSameDay } from "date-fns";
import { useState } from "react";
import { Emoji, EmojiProvider } from "react-apple-emojis";
import emojiData from "react-apple-emojis/src/data.json";
import { Badge } from "./ui/badge";
export const CalendarGrid = () => {
  const viewMode = useCalendarStore((state) => state.viewMode);

  const currentDate = new Date();

  const daysWithEmojis = [
    { id: 1, name: "شنبه", emoji: "nerd-face" },
    { id: 2, name: "یکشنبه", emoji: "sun" },
    { id: 3, name: "دوشنبه", emoji: "frog" },
    { id: 4, name: "سه شنبه", emoji: "dumpling" },
    { id: 5, name: "چهارشنبه", emoji: "cyclone" },
    { id: 6, name: "پنجشنبه", emoji: "seedling" },
    { id: 7, name: "جمعه", emoji: "zombie" },
  ];
  const weekDays = Array.from({ length: 7 }, (_, i) => i + 10);
  const days = generateMonthGrid(currentDate);

  const [events, setEvents] = useState(generateDummyEvents());
  console.log(events);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { over, active } = event;

    if (!over) return;

    const eventId = active.id.toString().replace("ev-", "");
    const newDate = over.id; 

    setEvents((prev) =>
      prev.map((ev) =>
        ev.id.toString() === eventId ? { ...ev, date: new Date(newDate as string) } : ev,
      ),
    );

    try {
      console.log(event);
      
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
  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex flex-col w-full h-full pt-14 overflow-y-hidden">
        <div className="grid grid-cols-7">
          {daysWithEmojis.map((day) => (
            <div key={day.id} className="p-1 m-1 flex justify-center gap-2 items-center">
              {day.name}
              <EmojiProvider data={emojiData}>
                <Emoji name={day.emoji} width={16} style={{ height: "16px" }} />
              </EmojiProvider>
            </div>
          ))}
        </div>
        {/* Main Grid */}
        <div className="flex-1 ">
          {viewMode === "dayGridMonth" ? (
            <div className="flex-1 grid grid-cols-7 grid-rows-5 h-full">
              {days.map((day, index) => (
                <DayCell key={index} day={day}>
                  {/* رندر کردن رویدادهای مربوط به این روز */}
                  {events
                    .filter((ev) => isSameDay(ev.date, day.date))
                    .map((ev) => (
                      <DraggableEvent key={ev.id} event={ev} />
                    ))}
                </DayCell>
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
    opacity: isDragging ? 0.5 : 1, // وقتی درگ میشه کمرنگ بشه
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
      className="bg-blue-600 text-white text-[11px] p-1.5 mb-1 rounded-md shadow-sm touch-none"
    >
      {event.title}
    </div>
  );
};

// --- کامپوننت Droppable (سلول روز) ---
const DayCell = ({ day, children }: { day: any; children: React.ReactNode }) => {
  const dateKey = format(day.date, "yyyy-MM-dd"); // تبدیل تاریخ به فرمت رشته برای ID
  const { setNodeRef, isOver } = useDroppable({
    id: dateKey,
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col items-start p-2 border-b border-l min-h-30 transition-all
        ${isOver ? "bg-blue-100/50 scale-[0.98]" : "hover:bg-slate-50"}`}
    >
      <div className="flex justify-end w-full mb-1">
        <Badge
          variant="secondary"
          className={`${isSameDay(day.date, new Date()) ? "bg-blue-500 text-white" : ""}`}
        >
          {day.dayNumber}
        </Badge>
      </div>
      <div className="w-full flex-1">{children}</div>
    </div>
  );
};
