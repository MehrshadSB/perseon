import type { ViewMode } from "@/store/calender";
import {
  addDays,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isSameYear,
  startOfMonth,
  startOfWeek,
} from "date-fns-jalali";

export const generateMonthGrid = (viewDate: Date) => {
  const monthStart = startOfMonth(viewDate);
 
  const startDate = startOfWeek(monthStart, { weekStartsOn: 6 });


  const totalDays = 35;

  return Array.from({ length: totalDays }).map((_, i) => {
    const date = addDays(startDate, i);
    return {
      date,
      dayNumber: format(date, "d"),
      isCurrentMonth: isSameMonth(date, monthStart),
    };
  });
};

export const getCalendarRangeTitle = (date: Date, view: ViewMode) => {
  let start: Date;
  let end: Date;

  if (view === "timeGridWeek") {
    start = startOfWeek(date, { weekStartsOn: 6 }); 
    end = endOfWeek(date, { weekStartsOn: 6 });
  } else if (view === "dayGridMonth") {
    start = startOfMonth(date);
    end = endOfMonth(date);
  } else {
    return format(date, "d MMMM yyyy"); 
  }

  if (isSameMonth(start, end)) {
    return format(start, "MMMM yyyy");
  }

  const firstMonth = format(start, "MMMM");
  const lastMonth = format(end, "MMMM");
  const firstYear = format(start, "yyyy");
  const lastYear = format(end, "yyyy");

  if (!isSameYear(start, end)) {
    return `${firstMonth} ${firstYear} - ${lastMonth} ${lastYear}`;
  }

  return `${firstMonth} - ${lastMonth} ${firstYear}`;
};
