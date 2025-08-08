"use client";

import React from "react";
import Sidebar from "@/components/ui/Sidebar";
import StudioHeader from "@/components/ui/StudioHeader";
import { useSidebarNavigation } from "@/hooks/useSidebarNavigation";

export default function ClonesPage() {
  const navigationItems = useSidebarNavigation();

  const recentItems = [
    { id: "1", name: "AI Assistant 1" },
    { id: "2", name: "AI Assistant 2" },
    { id: "3", name: "AI Assistant 3" },
  ];

  return (
    <div className="flex h-screen">
      <Sidebar
        userName="Utkarsh Chandel"
        workspaceName="CommunalAI"
        workspaces={[]}
        navigationItems={navigationItems}
        recentItems={recentItems}
        onWorkspaceChange={(workspace) =>
          console.log("Workspace changed to:", workspace)
        }
      />

      <div className="flex-1 relative overflow-y-auto bg-gray-50">
        <StudioHeader />
        <div className="p-8">{/* Empty main section for now */}</div>
      </div>
    </div>
  );
}
