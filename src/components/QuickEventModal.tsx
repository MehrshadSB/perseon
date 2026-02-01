import type { CreateEventDto, CreateRecurrenceDto } from "@/api/events.api";
import { Button } from "@heroui/button";
import { TimeInput } from "@heroui/date-input";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Time } from "@internationalized/date";

import { format } from "date-fns-jalali";
import { AnimatePresence, motion } from "framer-motion";
import { AlignLeft, Clock, Repeat, X } from "lucide-react";
import { useEffect, useState } from "react";

interface QuickEventModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  modalPos: { top: number; left: number };
  selectedRange: { start: Date; end: Date };
  setSelectedRange: React.Dispatch<React.SetStateAction<{ start: Date; end: Date }>>;
  pageId: string;
  onSave: (event: CreateEventDto, recurrence?: CreateRecurrenceDto) => void;
}

export const QuickEventModal = ({
  showModal,
  setShowModal,
  modalPos,
  selectedRange,
  setSelectedRange,
  pageId,
  onSave,
}: QuickEventModalProps) => {
  // اطلاعات اصلی رویداد
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState(format(selectedRange.start, "HH:mm"));
  const [endTime, setEndTime] = useState(format(selectedRange.end, "HH:mm"));

  // تنظیمات رویداد
  const [isAllDay, setIsAllDay] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);

  // تنظیمات تکرار
  const [freq, setFreq] = useState<"DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY">("WEEKLY");
  const [interval, setInterval] = useState(1);
  const [recurrenceEndType, setRecurrenceEndType] = useState<"never" | "count" | "until">("count");
  const [count, setCount] = useState(10);
  const [until, setUntil] = useState("");

  // آپدیت زمان‌های انتخاب شده
  useEffect(() => {
    if (showModal) {
      setStartTime(format(selectedRange.start, "HH:mm"));
      setEndTime(format(selectedRange.end, "HH:mm"));
    }
  }, [selectedRange, showModal]);

  // ریست فرم هنگام باز شدن مودال
  useEffect(() => {
    if (showModal) {
      setTitle("");
      setDescription("");
      setIsAllDay(false);
      setIsRecurring(false);
      setFreq("WEEKLY");
      setInterval(1);
      setRecurrenceEndType("count");
      setCount(10);
      setUntil("");
    }
  }, [showModal]);

  // مدیریت رویداد تمام روز
  useEffect(() => {
    if (isAllDay) {
      const newStart = new Date(selectedRange.start);
      newStart.setHours(0, 0, 0, 0);
      const newEnd = new Date(selectedRange.end);
      newEnd.setHours(23, 59, 59, 999);
      setSelectedRange({ start: newStart, end: newEnd });
      setStartTime("00:00");
      setEndTime("23:59");
    }
  }, [isAllDay]);

  // تابع تغییر زمان
  const handleTimeChange = (type: "start" | "end", value: Time | null) => {
    if (!value) return;

    const timeString = `${value.hour.toString().padStart(2, "0")}:${value.minute.toString().padStart(2, "0")}`;
    if (type === "start") setStartTime(timeString);
    else setEndTime(timeString);

    const newDate = new Date(selectedRange[type]);
    newDate.setHours(value.hour, value.minute, 0, 0);
    setSelectedRange((prev) => ({ ...prev, [type]: newDate }));
  };

  // تابع ذخیره رویداد
  const handleSave = () => {
    if (!title.trim()) return;

    // داده‌های اصلی رویداد (بدون isRecurring)
    const eventData: CreateEventDto = {
      title: title.trim(),
      description: description.trim() || undefined,
      startTimeUtc: selectedRange.start.toISOString(),
      endTimeUtc: selectedRange.end.toISOString(),
      pageId,
      isAllDay,
    };

    // داده‌های تکرار (فقط اگر فعال باشد)
    let recurrenceData: CreateRecurrenceDto | undefined = undefined;
    if (isRecurring) {
      recurrenceData = {
        freq,
        interval,
        ...(recurrenceEndType === "count" && { count }),
        ...(recurrenceEndType === "until" && until && { until }),
      };
    }

    onSave(eventData, recurrenceData);
    setShowModal(false);
  };
  const getFreqlabel = () => {
    switch (freq) {
      case "DAILY":
        return "روز";
      case "WEEKLY":
        return "هفته";
      case "MONTHLY":
        return "ماه";
      case "YEARLY":
        return "سال";
    }
  };

  return (
    <AnimatePresence>
      {showModal && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-[999]"
            onClick={() => setShowModal(false)}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "fixed",
              top: modalPos.top,
              left: modalPos.left,
              zIndex: 1000,
            }}
            className="w-[440px] bg-white dark:bg-slate-900 shadow-2xl rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                رویداد جدید
              </h3>
              <Button
                variant="ghost"
                className="h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                onClick={() => setShowModal(false)}
              >
                <X size={18} className="text-slate-500" />
              </Button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto px-5 py-4 space-y-5">
              <div>
                <Input
                  autoFocus
                  placeholder="عنوان رویداد"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-lg font-medium border-0 border-b-2 border-slate-200 dark:border-slate-700 rounded-none px-0 focus-visible:ring-0 focus-visible:border-blue-500"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Clock size={18} className="text-slate-400" />
                  <span className="text-sm font-medium">
                    {format(selectedRange.start, "EEEE، d MMMM yyyy")}
                  </span>
                </div>

                <div className="flex items-center justify-between pr-6">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isAllDay"
                      checked={isAllDay}
                      onChange={(e) => setIsAllDay(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <label htmlFor="isAllDay" className="text-sm cursor-pointer font-normal">
                      تمام روز
                    </label>
                  </div>

                  {!isAllDay && (
                    <div className="flex items-center gap-2" dir="ltr">
                      <TimeInput
                        value={
                          new Time(selectedRange.start.getHours(), selectedRange.start.getMinutes())
                        }
                        onChange={(val) => handleTimeChange("start", val)}
                      />
                      <span className="text-slate-400 text-sm">-</span>
                      <TimeInput
                        value={
                          new Time(selectedRange.end.getHours(), selectedRange.end.getMinutes())
                        }
                        onChange={(val) => handleTimeChange("end", val)}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Repeat size={18} className="text-slate-400" />
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isRecurring"
                      checked={isRecurring}
                      onChange={(e) => setIsRecurring(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <label htmlFor="isRecurring" className="text-sm cursor-pointer font-normal">
                      تکرار شونده
                    </label>
                  </div>
                </div>

                {isRecurring && (
                  <div className="pr-6 space-y-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                        نوع تکرار
                      </label>
                      <Select
                        selectedKeys={[freq]}
                        onSelectionChange={(keys) => {
                          const selectedKey = Array.from(keys)[0] as string;
                          setFreq(selectedKey as "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY");
                        }}
                        className="bg-white dark:bg-slate-900"
                      >
                        <SelectItem key="DAILY">روزانه</SelectItem>
                        <SelectItem key="WEEKLY">هفتگی</SelectItem>
                        <SelectItem key="MONTHLY">ماهانه</SelectItem>
                        <SelectItem key="YEARLY">سالانه</SelectItem>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                        هر {interval > 1 ? interval : ""} {getFreqlabel()}
                      </label>
                      <Input
                        type="number"
                        min="1"
                        max="365"
                        value={interval.toString()}
                        onValueChange={(value) => setInterval(Math.max(1, Number(value)))}
                        className="bg-white dark:bg-slate-900"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                        پایان
                      </label>
                      <Select
                        selectedKeys={[recurrenceEndType]}
                        onSelectionChange={(keys) => {
                          const selectedKey = Array.from(keys)[0] as string;
                          setRecurrenceEndType(selectedKey as "never" | "count" | "until");
                        }}
                        className="bg-white dark:bg-slate-900"
                      >
                        <SelectItem key="never">هرگز</SelectItem>
                        <SelectItem key="count">بعد از تعداد</SelectItem>
                        <SelectItem key="until">در تاریخ</SelectItem>
                      </Select>
                    </div>

                    {recurrenceEndType === "count" && (
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                          تعداد رخداد
                        </label>
                        <Input
                          type="number"
                          min="1"
                          max="999"
                          value={count.toString()}
                          onValueChange={(value) => setCount(Math.max(1, Number(value)))}
                          className="bg-white dark:bg-slate-900"
                        />
                      </div>
                    )}

                    {recurrenceEndType === "until" && (
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                          تا تاریخ
                        </label>
                        <Input
                          type="date"
                          value={until}
                          onValueChange={setUntil}
                          className="bg-white dark:bg-slate-900"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* توضیحات */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <AlignLeft size={18} className="text-slate-400" />
                  <label className="text-sm font-medium">توضیحات</label>
                </div>
                <Input
                  placeholder="افزودن توضیحات..."
                  value={description}
                  onValueChange={setDescription}
                  classNames={{
                    input: "min-h-[72px] py-2",
                    inputWrapper: "bg-slate-50 dark:bg-slate-800/50",
                  }}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 px-5 py-4 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-800">
              <Button
                variant="ghost"
                onClick={() => setShowModal(false)}
                className="hover:bg-white dark:hover:bg-slate-800"
              >
                انصراف
              </Button>
              <Button
                color="primary"
                onClick={handleSave}
                isDisabled={!title.trim()}
                className="px-6"
              >
                ذخیره رویداد
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
