import useCalendarStore from "@/store/calender";
import type { CalendarApi } from "@fullcalendar/core/index.js";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useEffect, useRef } from "react";

export default function AutoCalendar() {
  const calendarRef = useRef<FullCalendar>(null);
  const viewMode = useCalendarStore((state) => state.viewMode);

  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi: CalendarApi = calendarRef.current.getApi();
      if (calendarApi.view.type !== viewMode) {
        calendarApi.changeView(viewMode);
      }
    }
  }, [viewMode]);

  return (
    <div className="mt-14">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        handleWindowResize={true} // این گزینه را فعال بگذارید
        locale={"fa"}
        direction="rtl"
        firstDay={6}
        headerToolbar={false}
        initialView={viewMode}
        editable={true}
        events={[
          { title: "جلسه تیم فنی", date: "2025-12-20" },
          { title: "ارائه پروژه", start: "2025-12-22", end: "2025-12-24" },
        ]}
        viewDidMount={(arg) => {
          if (arg.view.type !== viewMode) {
            // اگر لازم بود اینجا هم setViewMode بزن
          }
        }}
      />
    </div>
  );
}
