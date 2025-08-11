"use client";

import React from "react";

export default function EditIcon({
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
      <path d="M13.586 3.586a2 2 0 0 1 2.828 2.828l-9.9 9.9a2 2 0 0 1-.878.5l-3.12.78a.75.75 0 0 1-.91-.91l.78-3.12a2 2 0 0 1 .5-.878l9.9-9.9Z" />
      <path d="M12.172 4.999 15 7.828" />
    </svg>
  );
}
