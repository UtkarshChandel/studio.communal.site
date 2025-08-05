"use client";

import React from "react";

interface BackgroundGradientProps {
  /** Gradient variant - predefined color schemes */
  variant?:
    | "purple-blue"
    | "blue-cyan"
    | "pink-purple"
    | "orange-red"
    | "green-blue"
    | "custom";
  /** Custom gradient colors when variant is 'custom' */
  customColors?: {
    from: string;
    via?: string;
    to: string;
  };
  /** Gradient direction */
  direction?:
    | "to-r"
    | "to-l"
    | "to-t"
    | "to-b"
    | "to-tr"
    | "to-tl"
    | "to-br"
    | "to-bl";
  /** Opacity of the gradient (0-100) */
  opacity?: number;
  /** Additional CSS classes */
  className?: string;
  /** Children to render on top of the gradient */
  children?: React.ReactNode;
  /** Whether to use as fixed background */
  fixed?: boolean;
  /** Blur effect intensity */
  blur?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  /** Animation type */
  animate?: "none" | "pulse" | "gradient-shift" | "float";
}

const BackgroundGradient: React.FC<BackgroundGradientProps> = ({
  variant = "purple-blue",
  customColors,
  direction = "to-br",
  opacity = 100,
  className = "",
  children,
  fixed = false,
  blur = "none",
  animate = "none",
}) => {
  // Define gradient variants
  const gradientVariants = {
    "purple-blue": "from-purple-400 via-purple-500 to-blue-400",
    "blue-cyan": "from-blue-400 via-blue-500 to-cyan-400",
    "pink-purple": "from-pink-400 via-purple-500 to-purple-600",
    "orange-red": "from-orange-400 via-red-500 to-red-600",
    "green-blue": "from-green-400 via-teal-500 to-blue-500",
    custom: customColors
      ? `from-[${customColors.from}] ${
          customColors.via ? `via-[${customColors.via}]` : ""
        } to-[${customColors.to}]`
      : "from-purple-400 to-blue-400",
  };

  // Animation classes
  const animationClasses = {
    none: "",
    pulse: "animate-pulse",
    "gradient-shift": "animate-gradient-x",
    float: "animate-bounce",
  };

  // Blur classes
  const blurClasses = {
    none: "",
    sm: "blur-sm",
    md: "blur-md",
    lg: "blur-lg",
    xl: "blur-xl",
    "2xl": "blur-2xl",
    "3xl": "blur-3xl",
  };

  const baseClasses = `
    bg-gradient-${direction}
    ${gradientVariants[variant]}
    ${blurClasses[blur]}
    ${animationClasses[animate]}
    ${fixed ? "fixed inset-0" : "absolute inset-0"}
    ${opacity !== 100 ? `opacity-${Math.round(opacity / 10) * 10}` : ""}
    ${className}
  `
    .trim()
    .replace(/\s+/g, " ");

  return (
    <div className="relative">
      {/* Background Gradient Layer */}
      <div
        className={baseClasses}
        style={{
          ...(opacity !== 100 && { opacity: opacity / 100 }),
          ...(variant === "custom" &&
            customColors && {
              background: `linear-gradient(${direction.replace("to-", "")}, ${
                customColors.from
              }, ${customColors.via || ""}, ${customColors.to})`,
            }),
        }}
      />

      {/* Overlay pattern for texture (optional) */}
      <div
        className={`absolute inset-0 opacity-20 ${fixed ? "fixed" : ""}`}
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                           radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
};

export default BackgroundGradient;

// Export types for external use
export type { BackgroundGradientProps };
