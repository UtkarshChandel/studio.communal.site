import React from "react";

interface GradientBorderBoxProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
  innerClassName?: string;
}

export default function GradientBorderBox({
  children,
  className = "",
  animate = false,
  innerClassName = "",
}: GradientBorderBoxProps) {
  return (
    <div
      className={`relative rounded-[14px] shadow-lg ${
        animate ? "p-[3px]" : "p-[2px]"
      } ${className}`}
      style={{
        background: animate
          ? `conic-gradient(from 0deg, #8b5cf6, #3b82f6, #8b5cf6, #a855f7, #8b5cf6)`
          : `linear-gradient(90deg, #a78bfa, #60a5fa, #a78bfa)`,
        animation: animate ? "gradient-rotate 3s linear infinite" : undefined,
      }}
    >
      <div
        className={`bg-[#f7f7f7] rounded-xl w-full h-full ${innerClassName}`}
      >
        {children}
      </div>

      <style jsx>{`
        @keyframes gradient-rotate {
          0% {
            background: conic-gradient(
              from 0deg,
              #8b5cf6,
              #3b82f6,
              #8b5cf6,
              #a855f7,
              #8b5cf6
            );
          }
          25% {
            background: conic-gradient(
              from 90deg,
              #8b5cf6,
              #3b82f6,
              #8b5cf6,
              #a855f7,
              #8b5cf6
            );
          }
          50% {
            background: conic-gradient(
              from 180deg,
              #8b5cf6,
              #3b82f6,
              #8b5cf6,
              #a855f7,
              #8b5cf6
            );
          }
          75% {
            background: conic-gradient(
              from 270deg,
              #8b5cf6,
              #3b82f6,
              #8b5cf6,
              #a855f7,
              #8b5cf6
            );
          }
          100% {
            background: conic-gradient(
              from 360deg,
              #8b5cf6,
              #3b82f6,
              #8b5cf6,
              #a855f7,
              #8b5cf6
            );
          }
        }
      `}</style>
    </div>
  );
}
