"use client";

import Sidebar from "@/components/ui/Sidebar";
import BackgroundWrapper from "@/components/ui/BackgroundWrapper";
import HeroSection from "@/components/ui/HeroSection";
import HeroHeading from "@/components/ui/HeroHeading";
import HeroSubtitle from "@/components/ui/HeroSubtitle";
import {
  HomeIcon,
  DocumentDuplicateIcon,
  ClipboardDocumentIcon,
  ShoppingBagIcon,
  CogIcon,
} from "@heroicons/react/24/outline";

export default function Home() {
  const navigationItems = [
    {
      id: "home",
      label: "Home",
      icon: <HomeIcon />,
      isActive: true,
      onClick: () => console.log("Home clicked"),
    },
    {
      id: "clones",
      label: "My Clones",
      icon: <DocumentDuplicateIcon />,
      onClick: () => console.log("My Clones clicked"),
    },
    {
      id: "templates",
      label: "Templates",
      icon: <ClipboardDocumentIcon />,
      onClick: () => console.log("Templates clicked"),
    },
    {
      id: "marketplace",
      label: "Marketplace",
      icon: <ShoppingBagIcon />,
      onClick: () => console.log("Marketplace clicked"),
    },
    {
      id: "settings",
      label: "Settings",
      icon: <CogIcon />,
      onClick: () => console.log("Settings clicked"),
    },
  ];

  const recentItems = [
    { id: "1", name: "Employee Onboarding Ag..." },
    { id: "2", name: "Customer Support Agent" },
    { id: "3", name: "Shubham's Agent" },
    { id: "4", name: "Utkarsh's Agent" },
    { id: "5", name: "PRD Review Agent" },
    { id: "6", name: "Design Review Agent" },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar
        userName="sneha Gupta"
        workspaceName="My Workspace"
        workspaces={[]}
        navigationItems={navigationItems}
        recentItems={recentItems}
        onWorkspaceChange={(workspace) =>
          console.log("Workspace changed to:", workspace)
        }
      />

      {/* Main Content Area */}
      <div className="flex-1 relative">
        <BackgroundWrapper className="h-full">
          <HeroSection>
            <HeroHeading size="lg">
              Turn Your Expertise
              <br />
              Into Scalable AI Clones
            </HeroHeading>

            <HeroSubtitle size="md">
              Build. Train. Monetize. One Studio, Infinite Clones.
            </HeroSubtitle>
          </HeroSection>
        </BackgroundWrapper>
      </div>
    </div>
  );
}
