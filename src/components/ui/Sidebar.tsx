"use client";

import React from "react";
import UserProfile from "./UserProfile";
import NavigationList, { NavigationItem } from "./NavigationList";
import RecentItems from "./RecentItems";
import { useSidebarNavigation } from "@/hooks/useSidebarNavigation";
import { useUserStore } from "@/store/useUserStore";
import { useSessionStore } from "@/store/useSessionStore";
import { usePathname, useRouter } from "next/navigation";
import { useUIStore } from "@/store/useUIStore";

export default function Sidebar({ className = "" }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, currentWorkspace, workspaces, setCurrentWorkspace } =
    useUserStore();
  const navigationItems: NavigationItem[] = useSidebarNavigation();
  const sessionItems = useSessionStore((s) => s.sessions);
  const activeSessionId = useSessionStore((s) => s.activeSessionId);
  const sessionsLoading = useSessionStore((s) => s.loading);
  const setActive = useSessionStore((s) => s.setActiveSession);
  const recentItems = sessionItems.map((s) => ({
    id: s.id,
    name: s.name || s.id,
  }));
  const sidebarScrollTop = useUIStore((s) => s.sidebarScrollTop);
  const setSidebarScrollTop = useUIStore((s) => s.setSidebarScrollTop);
  const scrollRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = sidebarScrollTop;
  }, [sidebarScrollTop]);

  return (
    <div
      className={`w-64 bg-white border-r border-gray-200 flex flex-col h-screen ${className}`}
    >
      {/* User Profile Section */}
      <UserProfile
        userName={user?.name || ""}
        workspaceName={currentWorkspace?.name || "Workspace"}
        avatarUrl={user?.picture}
        workspaces={workspaces.map((w) => w.name)}
        onWorkspaceChange={(name) => {
          const w = workspaces.find((ws) => ws.name === name) || null;
          setCurrentWorkspace(w);
        }}
      />

      {/* Navigation Section */}
      <NavigationList items={navigationItems} />

      {/* Recent Items Section */}
      <div
        className="flex-1 overflow-y-auto"
        ref={scrollRef}
        onScroll={(e) =>
          setSidebarScrollTop((e.currentTarget as HTMLDivElement).scrollTop)
        }
      >
        <RecentItems
          activeId={pathname?.startsWith("/studio/") ? activeSessionId : null}
          isLoading={sessionsLoading}
          items={recentItems.map((r) => ({
            ...r,
            onClick: () => {
              setActive(r.id);
              router.push(`/studio/${r.id}`);
            },
          }))}
        />
      </div>
    </div>
  );
}
