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

  for (let i = 1; i <= 10; i++) {
    // ایجاد یک تاریخ تصادفی در ماه جاری
    const randomDay = Math.floor(Math.random() * 28) + 1;
    const date = new Date();
    date.setDate(randomDay);

    dummyEvents.push({
      id: i,
      title: `${titles[i % titles.length]} ${i}`,
      date: date,
    });
  }
  return dummyEvents;
};

// حالا توی کامپوننت استفاده کن:
