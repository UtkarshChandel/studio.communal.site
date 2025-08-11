"use client";

import React from "react";

export default function CloseIcon({
  className = "w-4 h-4",
}: {
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M6.28 6.22a.75.75 0 0 1 1.06 0L10 8.88l2.66-2.66a.75.75 0 1 1 1.06 1.06L11.06 9.94l2.66 2.66a.75.75 0 1 1-1.06 1.06L10 11l-2.66 2.66a.75.75 0 1 1-1.06-1.06L8.94 9.94 6.28 7.28a.75.75 0 0 1 0-1.06Z" />
    </svg>
  );
}
