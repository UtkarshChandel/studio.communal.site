"use client";

import React from "react";
import GradientCloud from "@/components/ui/GradientCloud";

interface PageLoaderProps {
  message?: string;
}

export default function PageLoader({
  message = "Loading...",
}: PageLoaderProps) {
  return (
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-white">
      {/* Background cloud - largest, slowest */}
      <div
        className="absolute pointer-events-none select-none"
        style={{
          top: "30vh",
          left: "35vw",
          animation: "spin 2s linear infinite",
        }}
      >
        <GradientCloud
          absolute={false}
          scale={1.7}
          rotation={0}
          opacity={0}
          blur="3xl"
        />
      </div>

      {/* Middle cloud - medium size, medium speed */}
      <div
        className="absolute pointer-events-none select-none"
        style={{
          top: "38vh",
          left: "48vw",
          animation: "spin 40s linear infinite",
        }}
      >
        <GradientCloud
          absolute={false}
          scale={0}
          rotation={120}
          opacity={0.5}
          blur="2xl"
        />
      </div>

      {/* Foreground cloud - smallest, fastest */}
      <div
        className="absolute pointer-events-none select-none"
        style={{
          top: "42vh",
          left: "60vw",
          animation: "spin 25s linear infinite",
        }}
      >
        <GradientCloud
          absolute={false}
          scale={0}
          rotation={240}
          opacity={0.6}
          blur="xl"
        />
      </div>

      {/* Loading text container */}
      <div className="relative z-10 flex items-center gap-3 rounded-full bg-white/70 px-6 py-3 shadow-lg backdrop-blur-sm">
        <svg
          className="h-5 w-5 animate-spin text-[#3A0CA3]"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <span className="text-lg font-semibold text-gray-800">{message}</span>
      </div>
    </div>
  );
}
