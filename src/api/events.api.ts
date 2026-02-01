// api/events.api.ts
import { api } from "./axios";

export interface Event {
  id: string;
  pageId: string;
  ownerId: string;
  title: string;
  description?: string;
  startTimeUtc: string;
  endTimeUtc: string;
  isAllDay: boolean;
  isRecurring: boolean;
  createdAt: string;
  updatedAt: string;
  recurrence?: {
    id: string;
    freq: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
    interval: number;
    byDay?: string;
    byMonthDay?: number;
    until?: string;
    count?: number;
  };
}

export interface CreateEventDto {
  pageId: string;
  title: string;
  description?: string;
  startTimeUtc: string;
  endTimeUtc: string;
  isAllDay?: boolean;
}

export interface CreateRecurrenceDto {
  freq: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
  interval?: number;
  byDay?: string;
  byMonthDay?: number;
  until?: string;
  count?: number;
}

export interface UpdateEventDto {
  title?: string;
  description?: string;
  startTimeUtc?: string;
  endTimeUtc?: string;
  isAllDay?: boolean;
}

// دریافت تمام events
export async function fetchEvents(
  pageId?: string,
  startDate?: string,
  endDate?: string,
): Promise<Event[]> {
  const params: any = {};
  if (pageId) params.pageId = pageId;
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;

  const res = await api.get("/events", { params });
  return res.data.data;
}

// دریافت یک event خاص
export async function fetchEventById(id: string): Promise<Event> {
  const res = await api.get(`/events/${id}`);
  return res.data.data;
}

// ساخت event جدید
export async function createEvent(
  event: CreateEventDto,
  recurrence?: CreateRecurrenceDto,
): Promise<Event> {
  const res = await api.post("/events", { event, recurrence });
  return res.data.data;
}

// آپدیت event
export async function updateEvent(id: string, data: UpdateEventDto): Promise<Event> {
  const res = await api.patch(`/events/${id}`, data);
  return res.data.data;
}

// حذف event
export async function deleteEvent(id: string): Promise<void> {
  await api.delete(`/events/${id}`);
}
