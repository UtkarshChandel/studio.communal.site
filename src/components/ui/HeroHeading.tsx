import { ReactNode } from "react";

interface HeroHeadingProps {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function HeroHeading({
  children,
  className = "",
  size = "lg",
}: HeroHeadingProps) {
  const sizeClasses = {
    sm: "text-3xl md:text-4xl lg:text-5xl",
    md: "text-4xl md:text-5xl lg:text-6xl",
    lg: "text-5xl md:text-6xl lg:text-7xl",
    xl: "text-6xl md:text-7xl lg:text-8xl",
  };

  return (
    <h1
      className={`
      font-dm-sans font-bold text-gray-900 tracking-tight mb-6
      ${sizeClasses[size]}
      ${className}
    `}
    >
      {children}
    </h1>
  );
}
