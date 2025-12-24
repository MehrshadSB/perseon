import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns-jalali";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateTime(dateInput: Date) {
  const d = new Date(dateInput);

  const weekday = new Intl.DateTimeFormat("fa-IR", { weekday: "long" }).format(d);

  const day = d.getDate();

  const dayWithSuffix = day;
  const month = format(dateInput, "MMMM");
  const time =
    d.getHours().toString().padStart(2, "0") +
    ":" +
    d.getMinutes().toString().padStart(2, "0") +
    ":" +
    d.getSeconds().toString().padStart(2, "0");

  return {
    weekday: weekday,
    dayOfMonth: dayWithSuffix,
    month: month,
    time: time,
  };
}

export const generateDummyEvents = () => {
  const dummyEvents = [];
  const titles = [
    "جلسه اسکرام",
    "بررسی تسک‌ها",
    "ناهار تیمی",
    "تماس با مشتری",
    "فیکس باگ",
    "توسعه فرانت",
    "تست دیتابیس",
    "آپدیت داکس",
  ];

  const now = new Date();

  for (let i = 1; i <= 15; i++) {
    const randomDayOffset = Math.floor(Math.random() * 14) - 7;
    const eventDate = new Date(now);
    eventDate.setDate(now.getDate() + randomDayOffset);

    const startHour = Math.floor(Math.random() * 8) + 8;
    const startMinute = Math.random() > 0.5 ? 0 : 30;

    const startDate = new Date(eventDate);
    startDate.setHours(startHour, startMinute, 0, 0);

    const durationMinutes = (Math.floor(Math.random() * 5) + 1) * 30;
    const endDate = new Date(startDate);
    endDate.setMinutes(startDate.getMinutes() + durationMinutes);

    dummyEvents.push({
      id: i,
      title: `${titles[i % titles.length]} ${i}`,
      start: startDate,
      end: endDate,
      color: ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"][i % 4],
    });
  }
  return dummyEvents;
};

export function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()!.split(";").shift() || null;
  }
  return null;
}

export const auth = {
  isAuthenticated: () => {
    const accessToken = getCookie("accessToken")
    return Boolean(accessToken)
  },
}
