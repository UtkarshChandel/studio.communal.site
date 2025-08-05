"use client";

import UserProfile from "./UserProfile";
import NavigationList, { NavigationItem } from "./NavigationList";
import RecentItems from "./RecentItems";

interface RecentItem {
  id: string;
  name: string;
  onClick?: () => void;
}

interface SidebarProps {
  userName: string;
  workspaceName: string;
  avatarUrl?: string;
  workspaces?: string[];
  navigationItems: NavigationItem[];
  recentItems: RecentItem[];
  onWorkspaceChange?: (workspace: string) => void;
  className?: string;
}

export default function Sidebar({
  userName,
  workspaceName,
  avatarUrl,
  workspaces,
  navigationItems,
  recentItems,
  onWorkspaceChange,
  className = "",
}: SidebarProps) {
  return (
    <div
      className={`w-64 bg-white border-r border-gray-200 flex flex-col h-screen ${className}`}
    >
      {/* User Profile Section */}
      <UserProfile
        userName={userName}
        workspaceName={workspaceName}
        avatarUrl={avatarUrl}
        workspaces={workspaces}
        onWorkspaceChange={onWorkspaceChange}
      />

      {/* Navigation Section */}
      <NavigationList items={navigationItems} />

      {/* Recent Items Section */}
      <div className="flex-1 overflow-y-auto">
        <RecentItems items={recentItems} />
      </div>
    </div>
  );
}
