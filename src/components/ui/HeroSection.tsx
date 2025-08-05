import { ReactNode } from "react";

interface HeroSectionProps {
  children: ReactNode;
  className?: string;
}

export default function HeroSection({
  children,
  className = "",
}: HeroSectionProps) {
  return (
    <div
      className={`relative z-10 min-h-screen flex items-center justify-center px-4 ${className}`}
    >
      <div className="text-center max-w-4xl mx-auto">{children}</div>
    </div>
  );
}
