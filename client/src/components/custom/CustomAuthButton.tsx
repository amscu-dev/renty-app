import { cn } from "@/lib/utils";

function CustomAuthButton({
  disabled,
  onclick,
  children,
  className,
}: {
  className?: string;
  disabled: boolean;
  onclick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button className="auth-button" disabled={disabled} onClick={onclick}>
      <span className="shadow"></span>
      <span className="edge"></span>
      <span className={cn("front", className)}>
        <div className="flex items-center justify-center">{children}</div>
      </span>
    </button>
  );
}

export default CustomAuthButton;
