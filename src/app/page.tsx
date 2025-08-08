"use client";

import { useRouter } from "next/navigation";
import Sidebar from "@/components/ui/Sidebar";
import { useSidebarNavigation } from "@/hooks/useSidebarNavigation";
import BackgroundWrapper from "@/components/ui/BackgroundWrapper";
import HeroSection from "@/components/ui/HeroSection";
import HeroHeading from "@/components/ui/HeroHeading";
import HeroSubtitle from "@/components/ui/HeroSubtitle";
import { ChatInput } from "@/components/ui/ChatInput";
import WhatOthersAreBuildingSection from "@/components/ui/WhatOthersAreBuildingSection";
import { AnimatedChevron } from "@/components/ui/AnimatedChevron";
import {
  HomeIcon,
  DocumentDuplicateIcon,
  ClipboardDocumentIcon,
  ShoppingBagIcon,
  CogIcon,
  CommandLineIcon,
} from "@heroicons/react/24/outline";

export default function Home() {
  const router = useRouter();
  const navigationItems = useSidebarNavigation();

  const recentItems = [
    { id: "1", name: "AI Assistant 1" },
    { id: "2", name: "AI Assistant 2" },
    { id: "3", name: "AI Assistant 3" },
  ];
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
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

      {/* Main Content Area */}
      <div className="flex-1 relative overflow-y-auto">
        <BackgroundWrapper className="max-h-screen mb-30">
          {/* Hero Section */}
          <HeroSection className="h-full">
            <HeroHeading size="lg">
              Scale Your Expertise
              <br />
              With AI Clones
            </HeroHeading>

            <HeroSubtitle size="md">
              Build. Train. Monetize. One Studio, Infinite Clones.
            </HeroSubtitle>

            {/* Chat Input */}
            <div className="mt-12">
              <ChatInput
                onSubmit={(message: string) => {
                  console.log("User wants to scale:", message);
                  router.push("/studio");
                }}
              />
            </div>
          </HeroSection>
        </BackgroundWrapper>
        <AnimatedChevron
          className="absolute left-1/2 bottom-8 transform -translate-x-1/2"
          color="text-purple-700"
          size="md"
          count={1}
          direction="down"
        />

        {/* What Others Are Building Section */}

        <BackgroundWrapper className="min-h-screen" clouds={"typicalClouds"}>
          <WhatOthersAreBuildingSection />
        </BackgroundWrapper>
      </div>
    </div>
  );
}
