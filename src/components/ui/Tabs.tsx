"use client";

import React from "react";

export interface TabItem {
  value: string;
  label: string;
}

interface TabsProps {
  items: TabItem[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function Tabs({
  items,
  value,
  onChange,
  className = "",
}: TabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Settings Tabs"
      className={`inline-flex items-center bg-[rgba(104,112,118,0.1)] p-1 rounded-lg ${className}`}
    >
      {items.map((item) => {
        const isActive = item.value === value;
        return (
          <button
            key={item.value}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(item.value)}
            className={
              `px-3 py-1.5 rounded-md text-sm font-inter font-medium transition-colors cursor-pointer ` +
              (isActive
                ? "text-white bg-gradient-to-r from-[#4361EE] to-[#3A0CA3]"
                : "text-[#808080] hover:text-gray-700")
            }
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
