import { Skeleton } from "../ui/skeleton";

function DashboardPropertySkeletonCard() {
  return (
    <div className="flex h-[320px] flex-col rounded-xl bg-slate-200 shadow-lg">
      <Skeleton className="h-[172px] w-full rounded-b-none bg-slate-300" />
      <div className="flex flex-col gap-2 p-2 pt-4">
        <Skeleton className="h-[24px] w-3/4 rounded-xl bg-slate-300" />
        <Skeleton className="h-[12px] w-full rounded-xl bg-slate-300" />

        <div className="flex items-center justify-between">
          <Skeleton className="h-[18px] w-[65px] rounded-xl bg-slate-300" />
          <Skeleton className="h-[24px] w-[90px] rounded-xl bg-slate-300" />
        </div>
        <div className="mt-[17px] flex items-center justify-between gap-4">
          <Skeleton className="h-[24px] w-full rounded-xl bg-slate-300" />
          <Skeleton className="h-[24px] w-full rounded-xl bg-slate-300" />
          <Skeleton className="h-[24px] w-full rounded-xl bg-slate-300" />
        </div>
      </div>
    </div>
  );
}

export default DashboardPropertySkeletonCard;
