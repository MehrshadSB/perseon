import { CalendarGrid } from "@/components/CalenderGrid";
import CalendarLayout from "@/components/layout/CalendarLayout";
import { usePage } from "@/hooks/usePages";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/c/$pageId")({
  component: CalendarPage,
});

function CalendarPage() {
  const { pageId } = Route.useParams();
  const { data: page, isLoading, error } = usePage(pageId);

  if (isLoading) {
    return (
      <CalendarLayout>
        <div className="flex items-center justify-center h-full">
          <p>Loading...</p>
        </div>
      </CalendarLayout>
    );
  }

  if (error) {
    return (
      <CalendarLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-red-500">Error loading page</p>
        </div>
      </CalendarLayout>
    );
  }

  if (!page) {
    return (
      <CalendarLayout>
        <div className="flex items-center justify-center h-full">
          <p>Page not found</p>
        </div>
      </CalendarLayout>
    );
  }

  return (
    <CalendarLayout>
      <CalendarGrid pageId={page.id} page={page} />
    </CalendarLayout>
  );
}
