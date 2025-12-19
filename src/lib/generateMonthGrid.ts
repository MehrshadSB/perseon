import { eachDayOfInterval, endOfMonth, endOfWeek, format, startOfMonth } from "date-fns-jalali";

export const generateMonthGrid = (viewDate: Date) => {
  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(viewDate);

  // اگر می‌خواهید شروع تقویم دقیقاً ۱ آذر باشد اما ته آن پر شود:
  const start = monthStart;

  // پایان را تا آخرین روزِ هفته‌ای که ۳۰ آذر در آن است ادامه می‌دهیم
  // { weekStartsOn: 6 } یعنی هفته ما شنبه تمام می‌شود (جمعه آخر هفته است)
  const end = endOfWeek(monthEnd, { weekStartsOn: 6 });

  const days = eachDayOfInterval({
    start,
    end,
  });

  // تبدیل هر روز به یک آبجکت حاوی اطلاعات جلالی
  return days.map((day) => ({
    date: day, // آبجکت اصلی برای محاسبات
    jalaliDate: format(day, "yyyy/MM/dd"), // مثال: ۱۴۰۴/۰۹/۲۷
    dayNumber: format(day, "d"), // ۲۷
    monthName: format(day, "MMMM"), // آذر
    weekDayName: format(day, "EEEE"), // پنج‌شنبه
  }));
};

export const getJalaliMonthYear = (date: Date = new Date()) => {
  return format(date, "MMMM yyyy");
};
