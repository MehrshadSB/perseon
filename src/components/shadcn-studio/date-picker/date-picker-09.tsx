import { Clock8Icon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

interface TTimePicker {
  value: string; // فرمت باید HH:mm باشد
  onChange: (value: string) => void;
  onBlur?: () => void;
}

const TimePicker = ({ value, onChange, onBlur }: TTimePicker) => {
  const [internalValue, setInternalValue] = useState(value);

  // همگام‌سازی استیت داخلی با تغییرات بیرونی (مثلاً هنگام درگ در تقویم)
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, ""); // فقط اعداد

    // منطق ماسک: اگر کاربر زد 14، خودش بشه 14:
    if (val.length >= 3) {
      val = val.slice(0, 2) + ":" + val.slice(2, 4);
    }

    // محدود کردن طول ورودی
    if (val.length <= 5) {
      setInternalValue(val);

      // اگر فرمت کامل بود (مثلاً 12:00)، به والد خبر بده
      if (/^([01]\d|2[0-3]):([0-5]\d)$/.test(val)) {
        onChange(val);
      }
    }
  };

  return (
    <div className="w-full space-y-2">
      <div className="relative">
        <div className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3">
          <Clock8Icon className="size-4" />
        </div>
        <Input
          type="text" 
          placeholder="00:00"
          value={internalValue}
          onChange={handleTextChange}
          onBlur={() => {
            setInternalValue(value);
            onBlur?.();
          }}
          className="peer bg-background pl-9 font-mono text-sm tracking-widest focus-visible:ring-1"
        />
      </div>
    </div>
  );
};

export default TimePicker;
