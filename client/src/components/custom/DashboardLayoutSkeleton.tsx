import { cn } from "@/lib/utils";

function DashboardLayoutSkeleton({
  isLoading,
  message = "Preparing your dashboard",
}: {
  isLoading: boolean;
  message?: string;
}) {
  return (
    <div
      className={cn(
        "absolute inset-0 z-50 flex h-full flex-col items-center justify-center gap-10 bg-slate-900",
        isLoading ? "" : "skeleton-dashboard",
      )}
    >
      <div className="items flex items-end justify-center gap-2">
        <p className="m-0 font-mono text-3xl leading-none font-semibold tracking-[4px] text-slate-200">
          {message}
        </p>
        <div className="loader"></div>
      </div>
      <div className="h-9 w-32 border-spacing-1 overflow-hidden rounded-full border-[3px] border-white p-[4px]">
        <div className="h-full w-full overflow-hidden rounded-full">
          <div className="animate-loading h-full rounded-full bg-orange-600"></div>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayoutSkeleton;
