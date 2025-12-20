import useCalendarStore, { type ViewMode } from "@/store/calender";

export const ViewSwitcher: React.FC = () => {
  const { viewMode, setViewMode } = useCalendarStore();

  const modes: { id: ViewMode; label: string }[] = [
    { id: "dayGridMonth", label: "ماه" },
    { id: "timeGridWeek", label: "هفته" },
    { id: "timeGridDay", label: "روز" },
  ];

  return (
    <div className="flex items-center justify-end">
      <div className="flex gap-1 bg-gray-100 p-1  rounded-lg border border-gray-200">
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => setViewMode(mode.id)}
            className={`px-4 py-1.5 text-sm font-medium transition-all duration-200 rounded-md ${
              viewMode === mode.id
                ? "bg-card text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {mode.label}
          </button>
        ))}
      </div>
    </div>
  );
};
