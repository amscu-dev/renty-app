import { cn } from "@/lib/utils";
import { X } from "lucide-react";

function CognitoError({ message }: { message: string }) {
  const show = message.trim().length > 0;
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-1 rounded-md bg-red-200 px-4 py-2 font-medium text-red-600",
        show ? "erorr-animation visible" : "invisible",
      )}
      role="alert"
      aria-live="polite"
      aria-hidden={!show}
    >
      <p>{show ? message : "\u00A0"}</p>{" "}
      {/* placeholder pt. înălțime stabilă */}
    </div>
  );
}

export default CognitoError;
