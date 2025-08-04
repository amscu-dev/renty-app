type AnimatedTextProp = {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
};

const AnimatedText = ({
  text,
  disabled = false,
  speed = 5,
  className = "",
}: AnimatedTextProp) => {
  const animationDuration = `${speed}s`;

  return (
    <div
      className={`text-[#b5b5b5a4] bg-clip-text inline-block ${
        disabled ? "" : "animate-shine"
      } ${className}`}
      style={{
        backgroundImage:
          "linear-gradient(120deg, rgba(255, 255, 255, 0) 40%, rgb(255, 255, 255) 50%, rgba(255, 255, 255, 0) 60%)",
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
