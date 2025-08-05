"use client";

import React from "react";

interface GradientCloudProps {
  /** Size scale factor */
  scale?: number;
  /** Position from top (in vh units) */
  top?: number;
  /** Position from left (in vw units) */
  left?: number;
  /** Rotation angle in degrees */
  rotation?: number;
  /** Opacity (0-1) */
  opacity?: number;
  /** Additional CSS classes */
  className?: string;
  /** Whether to use absolute positioning */
  absolute?: boolean;
  /** Custom colors override */
  colors?: {
    start: string;
    startStop: string;
    middle: string;
    end: string;
  };
  /** Blur intensity */
  blur?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
}

const GradientCloud: React.FC<GradientCloudProps> = ({
  scale = 1,
  top = 0,
  left = 0,
  rotation = 54.108,
  opacity = 0.65,
  className = "",
  absolute = true,
  colors = {
    start: "#3A0CA3",
    startStop: "#3A0CA3",
    middle: "#BBB9DC",
    end: "#CAF4F7",
  },
  blur = "3xl",
}) => {
  // Use exact Figma dimensions
  const baseWidth = 940.66;
  const baseHeight = 395.55;

  // Ellipse center and radii from Figma
  const centerX = baseWidth / 2; // 470.33
  const centerY = baseHeight / 2; // 197.775
  const radiusX = centerX; // 470.33
  const radiusY = centerY; // 197.775

  const gradientId = `gradient-cloud-${Math.random()
    .toString(36)
    .substr(2, 9)}`;

  const blurClasses = {
    sm: "blur-sm",
    md: "blur-md",
    lg: "blur-lg",
    xl: "blur-xl",
    "2xl": "blur-2xl",
    "3xl": "blur-3xl",
  };

  return (
    <div
      className={`${absolute ? "absolute" : "relative"} ${
        blurClasses[blur]
      } ${className}`}
      style={{
        width: `${(baseWidth * scale) / 16}rem`,
        height: `${(baseHeight * scale) / 16}rem`,
        top: absolute ? `${top}vh` : undefined,
        left: absolute ? `${left}vw` : undefined,
        transform: `rotate(${rotation}deg) scale(${scale})`,
        transformOrigin: "center",
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${baseWidth} ${baseHeight}`}
        className="w-full h-full"
        style={{
          overflow: "visible",
        }}
      >
        <defs>
          {/* Linear gradient matching Figma exactly */}
          <linearGradient
            id={gradientId}
            x1="0%"
            y1="50%"
            x2="100%"
            y2="50%"
            gradientUnits="objectBoundingBox"
          >
            <stop offset="0%" stopColor={colors.start} />
            <stop offset="7%" stopColor={colors.startStop} />
            <stop offset="42%" stopColor={colors.middle} />
            <stop offset="61%" stopColor={colors.end} />
          </linearGradient>

          {/* Elliptical clipping path */}
          <clipPath id={`clip-${gradientId}`}>
            <ellipse cx={centerX} cy={centerY} rx={radiusX} ry={radiusY} />
          </clipPath>
        </defs>

        {/* Elliptical gradient shape */}
        <ellipse
          cx={centerX}
          cy={centerY}
          rx={radiusX}
          ry={radiusY}
          fill={`url(#${gradientId})`}
          fillOpacity={opacity}
          clipPath={`url(#clip-${gradientId})`}
        />
      </svg>
    </div>
  );
};

export default GradientCloud;
export type { GradientCloudProps };
