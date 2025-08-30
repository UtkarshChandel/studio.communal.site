"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

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
  /** Inline style for container */
  style?: React.CSSProperties;
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

type AnimatableConfig = {
  scale?: number;
  top?: number;
  left?: number;
  rotation?: number;
  opacity?: number;
  colors?: GradientCloudProps["colors"];
  blur?: GradientCloudProps["blur"];
};

type GradientCloudAnimatedProps = {
  animating: true;
  fromGradientCloudConfig: AnimatableConfig;
  toGradientCloudConfig: AnimatableConfig;
  /** Duration in ms for a linear animation */
  duration?: number;
  /** Optional delay before starting the animation in ms */
  delay?: number;
  /** Additional CSS classes applied to container */
  className?: string;
  /** Whether to use absolute positioning for container */
  absolute?: boolean;
  /** Inline style for container */
  style?: React.CSSProperties;
};

type GradientCloudComponentProps =
  | (GradientCloudProps & { animating?: false })
  | GradientCloudAnimatedProps;

const DEFAULTS: Required<
  Omit<
    GradientCloudProps,
    "className" | "absolute" | "colors" | "blur" | "style"
  >
> & {
  colors: NonNullable<GradientCloudProps["colors"]>;
  blur: NonNullable<GradientCloudProps["blur"]>;
} = {
  scale: 1,
  top: 0,
  left: 0,
  rotation: 54.108,
  opacity: 0.65,
  colors: {
    start: "#3A0CA3",
    startStop: "#3A0CA3",
    middle: "#BBB9DC",
    end: "#CAF4F7",
  },
  blur: "3xl",
};

function resolveConfig(partial?: AnimatableConfig): typeof DEFAULTS {
  return {
    scale: partial?.scale ?? DEFAULTS.scale,
    top: partial?.top ?? DEFAULTS.top,
    left: partial?.left ?? DEFAULTS.left,
    rotation: partial?.rotation ?? DEFAULTS.rotation,
    opacity: partial?.opacity ?? DEFAULTS.opacity,
    colors: partial?.colors ?? DEFAULTS.colors,
    blur: partial?.blur ?? DEFAULTS.blur,
  };
}

const GradientCloud: React.FC<GradientCloudComponentProps> = (props) => {
  // Use exact Figma dimensions
  const baseWidth = 940.66;
  const baseHeight = 395.55;

  // Ellipse center and radii from Figma
  const centerX = baseWidth / 2; // 470.33
  const centerY = baseHeight / 2; // 197.775
  const radiusX = centerX; // 470.33
  const radiusY = centerY; // 197.775

  // Keep gradient id stable across renders
  const gradientIdRef = useRef<string>(
    `gradient-cloud-${Math.random().toString(36).substr(2, 9)}`
  );
  const gradientId = gradientIdRef.current;

  const blurClasses = {
    sm: "blur-sm",
    md: "blur-md",
    lg: "blur-lg",
    xl: "blur-xl",
    "2xl": "blur-2xl",
    "3xl": "blur-3xl",
  };

  // Determine operating mode and current configuration
  const isAnimating = "animating" in props && props.animating === true;

  // Container-level props common to both modes
  const className = props.className ?? "";
  const absolute = props.absolute ?? true;
  const externalStyle = (props as { style?: React.CSSProperties }).style;

  // Animated mode: maintain a current config that will be transitioned via CSS
  const [current, setCurrent] = useState(() => {
    if (isAnimating) {
      return resolveConfig(
        (props as GradientCloudAnimatedProps).fromGradientCloudConfig
      );
    }
    // Static mode
    const p = props as GradientCloudProps;
    return resolveConfig({
      scale: p.scale,
      top: p.top,
      left: p.left,
      rotation: p.rotation,
      opacity: p.opacity,
      colors: p.colors,
      blur: p.blur,
    });
  });

  // Compute the target configuration when animating (not stored separately)
  useMemo(() => {
    if (!isAnimating) return current;
    return resolveConfig(
      (props as GradientCloudAnimatedProps).toGradientCloudConfig
    );
  }, [isAnimating, props, current]);

  const durationMs = isAnimating
    ? (props as GradientCloudAnimatedProps).duration ?? 1000
    : 0;
  const delayMs = isAnimating
    ? (props as GradientCloudAnimatedProps).delay ?? 0
    : 0;

  // Kick off animation when animating or when from/to change
  useEffect(() => {
    if (!isAnimating) return;
    // Reset to from config immediately
    setCurrent(
      resolveConfig(
        (props as GradientCloudAnimatedProps).fromGradientCloudConfig
      )
    );
    // In the next tick, move to target to trigger CSS transition
    const id = setTimeout(() => {
      setCurrent(
        resolveConfig(
          (props as GradientCloudAnimatedProps).toGradientCloudConfig
        )
      );
    }, Math.max(0, delayMs));
    return () => clearTimeout(id);
  }, [
    isAnimating,
    (props as GradientCloudAnimatedProps).fromGradientCloudConfig,
    (props as GradientCloudAnimatedProps).toGradientCloudConfig,
    delayMs,
  ]);

  // For non-animated usage, always reflect latest props directly
  const nonAnimatedResolved = useMemo(() => {
    if (isAnimating) return current;
    const p = props as GradientCloudProps;
    return resolveConfig({
      scale: p.scale,
      top: p.top,
      left: p.left,
      rotation: p.rotation,
      opacity: p.opacity,
      colors: p.colors,
      blur: p.blur,
    });
  }, [isAnimating, props, current]);

  const display = isAnimating ? current : nonAnimatedResolved;

  return (
    <div
      className={`${absolute ? "absolute" : "relative"} ${
        blurClasses[display.blur]
      } ${className}`}
      style={{
        width: `${(baseWidth * display.scale) / 16}rem`,
        height: `${(baseHeight * display.scale) / 16}rem`,
        top: absolute ? `${display.top}vh` : undefined,
        left: absolute ? `${display.left}vw` : undefined,
        transform: `rotate(${display.rotation}deg) scale(${display.scale})`,
        transformOrigin: "center",
        transition: isAnimating
          ? `transform linear ${durationMs}ms, top linear ${durationMs}ms, left linear ${durationMs}ms`
          : undefined,
        ...(externalStyle || {}),
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
            <stop offset="0%" stopColor={display.colors.start} />
            <stop offset="7%" stopColor={display.colors.startStop} />
            <stop offset="42%" stopColor={display.colors.middle} />
            <stop offset="61%" stopColor={display.colors.end} />
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
          fillOpacity={display.opacity}
          clipPath={`url(#clip-${gradientId})`}
          style={{
            transition: isAnimating
              ? `fill-opacity linear ${durationMs}ms`
              : undefined,
          }}
        />
      </svg>
    </div>
  );
};

export default GradientCloud;
export type { GradientCloudProps };
export type { GradientCloudAnimatedProps };
