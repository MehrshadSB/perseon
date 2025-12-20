import { useEffect, useState } from "react";

const LiveClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedDate = new Intl.DateTimeFormat("fa-IR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(time);

  const hours = time.getHours().toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");
  const seconds = time.getSeconds().toString().padStart(2, "0");

  const formattedTime = `${hours}:${minutes}:${seconds}`;

  return (
    <div className="w-full flex items-center justify-between">
      <div className="text-sm flex items-center">{formattedDate}</div>
      {/* <div
        className="text-2xl font-bold text-primary-600/70 tracking-widest"
        style={{ fontFamily: "digital" }}
      >
        {formattedTime}
      </div> */}
    </div>
  );
};

export default LiveClock;
