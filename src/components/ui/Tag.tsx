"use client";

import React from "react";

type TagVariant = "default" | "success";
type TagSize = "sm" | "md";

interface TagProps {
  label: string;
  variant?: TagVariant;
  size?: TagSize;
  className?: string;
}

export default function Tag({
  label,
  variant = "default",
  size = "sm",
  className = "",
}: TagProps) {
  const base = "inline-flex items-center justify-center rounded-md border";

  const sizeClasses: Record<TagSize, string> = {
    sm: "h-7 px-3 text-[14px] leading-[22px]",
    md: "h-8 px-3.5 text-sm",
  };

  const variants: Record<TagVariant, string> = {
    default: "border-[rgba(130,130,130,0.15)] text-[#828282] bg-transparent",
    success:
      "border-[rgba(52,168,83,0.3)] text-[#34a853] bg-[#f4f4f4] rounded-[10px]",
  };

  return (
    <span
      className={`${base} ${sizeClasses[size]} ${variants[variant]} ${className}`}
    >
      {label}
    </span>
  );
}
