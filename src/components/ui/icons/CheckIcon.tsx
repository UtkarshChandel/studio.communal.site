"use client";

import React from "react";

export default function CheckIcon({
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
      <path
        fillRule="evenodd"
        d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.5 7.6a1 1 0 0 1-1.43.01L3.29 10.9a1 1 0 1 1 1.42-1.41l3.05 3.08 6.79-6.892a1 1 0 0 1 1.154-.388z"
        clipRule="evenodd"
      />
    </svg>
  );
}
