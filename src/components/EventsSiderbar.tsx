import { formatDateTime } from "@/lib/utils";
import LiveClock from "./LiveClock";

const EVENTS = {
  data: [
    {
      id: 1024,
      title: "جلسه بررسی پروژه",
      start_at_utc: "2026-01-19T17:30:00Z",
      category: {
        label: "کاری",
        slug: "work",
        color: "#F2542D",
      },
      display_date: {
        weekday: "جمعه",
        day_number: 28,
        day_suffix: "بیست و هشتم",
        month_name: "آذر",
        year: 1404,
        time: "21:00",
        full_readable: "جمعه ۲۹ آذر ساعت ۲۱:۰۰",
      },
    },
  ],
  status: true,
  message: "success",
};

function EventsSiderbar() {
  
  return (
    <div className="">
      <h6 className="px-2 pb-2 flex gap-2">
        <LiveClock />
      </h6>
      <ul className="p-2 w-full">
        {EVENTS.data.map((event) => (
          <li className="flex items-cente justify-between">
            <div className="flex items-center gap-2" style={{ color: event.category.color }}>
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: event.category.color }}
              ></div>
              <span>{event.title}</span>
            </div>
            <span className="text-primary-800">{event.display_date.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EventsSiderbar;
