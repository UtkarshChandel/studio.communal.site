"use client";

import React from "react";

interface AvatarCircleProps {
  initials: string;
  imageUrl?: string;
  size?: number; // pixels
  className?: string;
}

export default function AvatarCircle({
  initials,
  imageUrl,
  size = 86,
  className = "",
}: AvatarCircleProps) {
  const dimension = { width: size, height: size } as const;
  return (
    <div
      className={`relative rounded-full bg-gray-200 border-2 border-white shadow-[0px_4px_6px_-2px_rgba(16,24,40,0.03)] overflow-hidden flex items-center justify-center ${className}`}
      style={dimension}
      aria-label="avatar"
    >
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt={initials}
          className="w-full h-full object-cover"
        />
      ) : (
        <span
          className="text-gray-600 font-medium"
          style={{ fontSize: Math.round(size * 0.28) }}
        >
          {initials.toUpperCase()}
        </span>
      )}
    </div>
  );
}
