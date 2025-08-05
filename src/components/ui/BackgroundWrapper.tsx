import { ReactNode } from "react";
import GradientCloud from "./GradientCloud";

interface CloudConfig {
  scale: number;
  top: number;
  left: number;
  rotation: number;
  opacity: number;
  blur: string;
}

interface BackgroundWrapperProps {
  children: ReactNode;
  clouds?: CloudConfig[];
  className?: string;
}

const defaultClouds: CloudConfig[] = [
  {
    scale: 1.2,
    top: -20,
    left: -10,
    rotation: 54.108,
    opacity: 0.65,
    blur: "3xl",
  },
  {
    scale: 0.8,
    top: 30,
    left: 70,
    rotation: 54.108,
    opacity: 0.4,
    blur: "2xl",
  },
];

export default function BackgroundWrapper({
  children,
  clouds = defaultClouds,
  className = "",
}: BackgroundWrapperProps) {
  return (
    <div
      className={`min-h-screen relative overflow-hidden bg-white ${className}`}
    >
      {/* Gradient Clouds */}
      {clouds.map((cloud, index) => (
        <GradientCloud
          key={index}
          scale={cloud.scale}
          top={cloud.top}
          left={cloud.left}
          rotation={cloud.rotation}
          opacity={cloud.opacity}
          blur={cloud.blur as "3xl" | "2xl" | "sm" | "md" | "lg" | "xl"}
        />
      ))}

      {/* Content */}
      {children}
    </div>
  );
}
