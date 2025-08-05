"use client";

import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

interface UserProfileProps {
  userName: string;
  workspaceName: string;
  avatarUrl?: string;
  workspaces?: string[];
  onWorkspaceChange?: (workspace: string) => void;
  className?: string;
}

export default function UserProfile({
  userName,
  workspaceName,
  avatarUrl,
  workspaces = [],
  onWorkspaceChange,
  className = "",
}: UserProfileProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className={`p-4 border-b border-gray-100 ${className}`}>
      <div
        className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={userName}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-white font-medium text-sm">
              {userName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </span>
          )}
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <p className="font-geist font-medium text-gray-900 truncate">
            {userName}
          </p>
          <p className="font-geist text-sm text-gray-500 truncate">
            {workspaceName}
          </p>
        </div>

        {/* Dropdown Arrow */}
        <ChevronDownIcon
          className={`w-4 h-4 text-gray-400 transition-transform ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Dropdown Menu */}
      {isDropdownOpen && workspaces.length > 0 && (
        <div className="mt-2 py-2 bg-white border border-gray-200 rounded-lg shadow-lg">
          {workspaces.map((workspace) => (
            <button
              key={workspace}
              className="w-full text-left px-3 py-2 text-sm font-geist text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => {
                onWorkspaceChange?.(workspace);
                setIsDropdownOpen(false);
              }}
            >
              {workspace}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
