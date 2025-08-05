"use client";

import { ReactNode } from "react";

export interface NavigationItem {
  id: string;
  label: string;
  icon: ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}

interface NavigationListProps {
  items: NavigationItem[];
  className?: string;
}

export default function NavigationList({
  items,
  className = "",
}: NavigationListProps) {
  return (
    <div className={`py-4 ${className}`}>
      <nav className="space-y-1">
        {items.map((item) => (
          <div key={item.id} className={item.isActive ? "mx-4" : "mx-2"}>
            <button
              onClick={item.onClick}
              className={`
                w-full flex items-center space-x-3 px-4 py-2.5 text-left rounded-md transition-all
                font-inter text-sm
                ${
                  item.isActive
                    ? "text-gray-700 font-[600]"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium"
                }
              `}
              style={
                item.isActive
                  ? {
                      background: `linear-gradient(90deg, 
                        rgba(67, 97, 238, 0.14) 0%, 
                        rgba(58, 12, 163, 0.14) 100%)`,
                    }
                  : {}
              }
            >
              <span
                className={`w-5 h-5 ${
                  item.isActive ? "text-gray-600" : "text-gray-400"
                }`}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          </div>
        ))}
      </nav>
    </div>
  );
}
