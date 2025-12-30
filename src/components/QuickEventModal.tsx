import { Button } from "@/components/ui/button"; // دکمه استاندارد shadcn
import { Input } from "@/components/ui/input"; // ورودی استاندارد shadcn
import { Textarea } from "@/components/ui/textarea"; // متن چند خطی shadcn
import { format } from "date-fns-jalali";
import { AnimatePresence, motion } from "framer-motion";
import { AlignLeft, Clock, X } from "lucide-react";
import { useEffect, useState } from "react";
import TimePicker from "./shadcn-studio/date-picker/date-picker-09";

interface QuickEventModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  modalPos: { top: number; left: number };
  selectedRange: { start: Date; end: Date };
  setSelectedRange: React.Dispatch<React.SetStateAction<{ start: Date; end: Date }>>;
  // بازگشت دیتا مطابق با اسکیما (startTimeUtc و endTimeUtc)
  onSave: (data: {
    title: string;
    description?: string;
    startTimeUtc: Date;
    endTimeUtc: Date;
    calendarId: string; // اجباری طبق اسکیما
  }) => void;
}
export const QuickEventModal = ({
  showModal,
  setShowModal,
  modalPos,
  selectedRange,
  setSelectedRange,
  onSave,
}: QuickEventModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState(format(selectedRange.start, "HH:mm"));
  const [endTime, setEndTime] = useState(format(selectedRange.end, "HH:mm"));

  // تابع کمکی برای اعتبارسنجی و آپدیت زمان
  const handleInputChange = (type: "start" | "end", value: string) => {
    if (type === "start") setStartTime(value);
    else setEndTime(value);

    // اگر فرمت درست بود (مثلاً 14:30)، آبجکت Date اصلی را آپدیت کن
    if (/^([01]\d|2[0-3]):([0-5]\d)$/.test(value)) {
      const [hours, minutes] = value.split(":").map(Number);
      const newDate = new Date(selectedRange[type]);
      newDate.setHours(hours, minutes);
      setSelectedRange((prev) => ({ ...prev, [type]: newDate }));
    }
  };

  // حتما useEffect را اضافه کنید
  useEffect(() => {
    if (showModal) {
      setStartTime(format(selectedRange.start, "HH:mm"));
      setEndTime(format(selectedRange.end, "HH:mm"));
    }
  }, [selectedRange, showModal]);

  // ریست کردن عنوان و توضیحات وقتی مودال بسته/باز می‌شود (اختیاری)
  useEffect(() => {
    if (showModal) {
      setTitle("");
      setDescription("");
    }
  }, [showModal]);
  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          style={{
            position: "fixed",
            top: modalPos.top,
            left: modalPos.left,
            zIndex: 1000,
          }}
          className="w-105 bg-white shadow-2xl rounded-xl border border-slate-200 p-4 flex flex-col gap-5"
        >
          {/* Header */}
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => setShowModal(false)}
            >
              <X size={18} className="text-muted-foreground" />
            </Button>
          </div>

          {/* Title - shadcn Input */}
          <div className="px-2">
            <Input
              autoFocus
              placeholder="افزودن عنوان"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl font-semibold border-none border-b-2 focus-visible:ring-0 focus-visible:border-blue-600 rounded-none px-0 shadow-none transition-all"
            />
          </div>

          {/* Time Selection Section */}
          <div className="flex items-start gap-3 px-2 text-slate-600">
            <Clock size={18} className="mt-1.5 text-slate-400" />
            <div className="flex w-full flex-col gap-3">
              <span className="text-sm font-medium">
                {format(selectedRange.start, "EEEE, d MMMM")}
              </span>
              <div className="flex items-center gap-2" dir="ltr">
                <TimePicker
                  value={endTime}
                  onChange={(val) => handleInputChange("end", val)}
                  onBlur={() => setEndTime(format(selectedRange.end, "HH:mm"))}
                />
                <span className="text-gray-400">تا</span>
                <TimePicker
                  value={startTime}
                  onChange={(val) => handleInputChange("start", val)}
                  onBlur={() => setStartTime(format(selectedRange.start, "HH:mm"))}
                />
              </div>
            </div>
          </div>

          {/* Description - shadcn Textarea */}
          <div className="flex items-start gap-3 px-2">
            <AlignLeft size={18} className="mt-2 text-slate-400" />
            <Textarea
              placeholder="افزودن توضیحات"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-25 focus-visible:ring-1 bg-slate-50/50"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 border-t pt-4">
            <Button variant="ghost" onClick={() => setShowModal(false)}>
              انصراف
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 px-8"
              onClick={() =>
                onSave({
                  title,
                  description,
                  startTimeUtc: selectedRange.start,
                  endTimeUtc: selectedRange.end,
                  calendarId: "primary-calendar-id", // مقدار پیش‌فرض
                })
              }
            >
              ذخیره
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
