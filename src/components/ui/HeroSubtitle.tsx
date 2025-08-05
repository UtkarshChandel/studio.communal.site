import { ReactNode } from "react";

interface HeroSubtitleProps {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function HeroSubtitle({
  children,
  className = "",
  size = "md",
}: HeroSubtitleProps) {
  const sizeClasses = {
    sm: "text-lg md:text-xl",
    md: "text-xl md:text-2xl",
    lg: "text-2xl md:text-3xl",
  };

  return (
    <p
      className={`
      font-geist text-gray-600 font-medium max-w-2xl mx-auto
      ${sizeClasses[size]}
      ${className}
    `}
    >
      {children}
    </p>
  );
}
