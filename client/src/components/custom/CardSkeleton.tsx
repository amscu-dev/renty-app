import { Skeleton } from "@/components/ui/skeleton";
function CardSkeleton() {
  return (
    <div className="flex h-40 rounded-xl bg-slate-200 shadow-lg">
      <div className="h-full w-1/3">
        <Skeleton className="h-full w-full rounded-r-none bg-slate-300" />
      </div>
      <div className="flex w-2/3 flex-col justify-between p-4">
        <div>
          <Skeleton className="mb-3 h-[20px] w-3/4 rounded-xl bg-slate-300" />
          <Skeleton className="mb-2 h-[10px] w-2/5 rounded-xl bg-slate-300" />
          <Skeleton className="h-[10px] w-1/5 rounded-xl bg-slate-300" />
        </div>
        <div className="flex items-center">
          <Skeleton className="mr-1 h-[10px] w-1/10 rounded-xl bg-slate-300" />
          <Skeleton className="mr-1 h-[10px] w-1/10 rounded-xl bg-slate-300" />
          <Skeleton className="mr-1 h-[10px] w-1/10 rounded-xl bg-slate-300" />
          <Skeleton className="ml-auto h-[15px] w-2/10 rounded-xl bg-slate-300" />
        </div>
      </div>
    </div>
  );
}

export default CardSkeleton;
