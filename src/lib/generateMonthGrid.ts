import { addDays, format, isSameMonth, startOfMonth, startOfWeek } from "date-fns-jalali";

export const generateMonthGrid = (viewDate: Date) => {
  // ۱. پیدا کردن اولین روز ماه (مثلاً ۱ دی)
  const monthStart = startOfMonth(viewDate);

  // ۲. پیدا کردن اولین شنبه‌ای که گرید باید از آن شروع شود
  // این کار باعث می‌شود روزهای آخر آذر که در هفته اول دی هستند هم جنریت شوند
  const startDate = startOfWeek(monthStart, { weekStartsOn: 6 });

  // ۳. گوگل کلندر معمولاً ۶ هفته (۴۲ روز) را نشان می‌دهد تا ارتفاع گرید ثابت بماند
  // اگر اصرار بر ۳۵ روز دارید، length را ۳۵ بگذارید (اما ممکن است برخی ماه‌ها ناقص شوند)
  const totalDays = 35;

  return Array.from({ length: totalDays }).map((_, i) => {
    const date = addDays(startDate, i);
    return {
      date,
      dayNumber: format(date, "d"),
      // تشخیص اینکه آیا این روز متعلق به همین ماه است یا ماه قبل/بعد
      isCurrentMonth: isSameMonth(date, monthStart),
    };
  });
};

export const getJalaliMonthYear = (date: Date = new Date()) => {
  return format(date, "MMMM yyyy");
};
