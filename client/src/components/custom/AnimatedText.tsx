"use client";
import usePrefersReducedMotion from "./../../hooks/usePrefersReducedMotion";

type AnimatedTextProp = {
  text: string;
  speed?: number;
  className?: string;
};

const AnimatedText = ({
  text,
  speed = 5,
  className = "",
}: AnimatedTextProp) => {
  const animationDuration = `${speed}s`;
  const prefersReducedMotion = usePrefersReducedMotion();
  return (
    <div
      className={`hidden bg-clip-text text-[#ffffff4b] md:inline-block ${
        prefersReducedMotion ? "" : "animate-shine"
      } ${className}`}
      style={{
        backgroundImage:
          "linear-gradient(120deg, rgba(255, 255, 255, 0) 40%, rgb(255, 119, 0) 50%, rgba(255, 255, 255, 0) 60%)",
        backgroundSize: "200% 100%",
        WebkitBackgroundClip: "text",
        animationDuration: animationDuration,
      }}
    >
      {text}
    </div>
  );
};

export default AnimatedText;
