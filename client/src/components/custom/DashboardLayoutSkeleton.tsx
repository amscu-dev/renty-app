import { cn } from "@/lib/utils";
import { ProgressBar } from "react-loader-spinner";

function DashboardLayoutSkeleton({ isLoading }: { isLoading: boolean }) {
  return (
    <div
      className={cn(
        "absolute inset-0 z-50 flex h-full flex-col items-center justify-center bg-amber-600",
        isLoading ? "" : "skeleton-dashboard",
      )}
    >
      <div className="items flex items-end justify-center gap-2">
        <p className="m-0 font-mono text-3xl leading-none font-semibold tracking-[4px] text-slate-200">
          Preparing your dashboard
        </p>
        <div className="loader"></div>
      </div>

      <ProgressBar
        visible={true}
        height="100"
        width="100"
        borderColor="white"
        // barColor=""

        ariaLabel="progress-bar-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
}

export default DashboardLayoutSkeleton;
