import React from "react";

interface AnimatedChevronProps {
  color?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  count?: number;
  direction?: "up" | "down" | "left" | "right";
}

export const AnimatedChevron: React.FC<AnimatedChevronProps> = ({
  color = "text-purple-700",
  size = "md",
  className = "",
  count = 3,
  direction = "down",
}) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const directionClasses = {
    up: "rotate-180",
    down: "",
    left: "-rotate-90",
    right: "rotate-90",
  };

  return (
    <div className={`flex flex-col items-center z-20 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <svg
          key={i}
          className={`${sizeClasses[size]} ${color} drop-shadow-md animate-bounce ${directionClasses[direction]}`}
          style={{
            animationDelay: `${i * 0.18}s`,
            marginTop: i === 0 ? 0 : "-0.5rem",
            opacity: 1 - i * 0.18,
          }}
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          viewBox="0 0 24 24"
        >
          <polyline
            points="6 10 12 16 18 10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </div>
  );
};
