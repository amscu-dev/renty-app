import { cn } from "@/lib/utils";
import { MapPinHouse } from "lucide-react";

function NoData({
  message = "No data found.",
  iconSize = 64,
  messageClassName,
  containerClassName,
  iconColor = "",
}: {
  message?: string;
  iconSize?: number;
  messageClassName?: string;
  containerClassName?: string;
  iconColor?: string;
}) {
  return (
    <div
      className={cn(
        "iconSize flex h-full w-full flex-col items-center justify-center gap-3 text-slate-700",
        containerClassName,
      )}
    >
      <MapPinHouse
        size={iconSize}
        color={iconColor ? iconColor : "currentColor"}
      />
      <p className={cn("font-mono text-lg font-semibold", messageClassName)}>
        {message}
      </p>
    </div>
  );
}

export default NoData;
