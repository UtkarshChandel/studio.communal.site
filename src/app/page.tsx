//src/app/page.tsx
"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";
import { useSidebarNavigation } from "@/hooks/useSidebarNavigation";
import BackgroundWrapper from "@/components/ui/BackgroundWrapper";
import HeroSection from "@/components/ui/HeroSection";
import HeroHeading from "@/components/ui/HeroHeading";
import HeroSubtitle from "@/components/ui/HeroSubtitle";
import { ChatInput } from "@/components/ui/ChatInput";
import { useStartSession } from "@/hooks/useStartSession";
import WhatOthersAreBuildingSection from "@/components/ui/WhatOthersAreBuildingSection";
import { AnimatedChevron } from "@/components/ui/AnimatedChevron";
import { ProtectedPage } from "@/components/ProtectedPage";
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
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const { start, submitting } = useStartSession();

  const recentItems = [
    { id: "1", name: "AI Assistant 1" },
    { id: "2", name: "AI Assistant 2" },
    { id: "3", name: "AI Assistant 3" },
  ];

  return (
    <ProtectedPage>
      <AppLayout>
        <div className="flex-1 relative overflow-y-auto">
          <BackgroundWrapper className="max-h-screen mb-30">
            {/* Hero Section */}
            <HeroSection className="h-full">
              <HeroHeading size="lg">
                Scale Your Expertise
                <br />
                With AI Clones
              </HeroHeading>

              <HeroSubtitle size="md">Build. Train. Monetize.</HeroSubtitle>

              {/* Chat Input */}
              <div className="mt-12">
                <ChatInput
                  onSubmit={(message: string) => {
                    // Stash immediately so the session page can consume it even if navigation wins the race
                    try {
                      const tempKey = "pendingMessage:__next__";
                      sessionStorage.setItem(tempKey, message);
                    } catch {}
                    void start(message);
                  }}
                />
              </div>
            </HeroSection>
            <AnimatedChevron
              className="absolute left-1/2 bottom-8 transform -translate-x-1/2"
              color="text-purple-700"
              size="md"
              count={1}
              direction="down"
              onClick={() => {
                bottomRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
            />
          </BackgroundWrapper>

          {/* What Others Are Building Section */}

          <div ref={bottomRef}>
            <BackgroundWrapper
              className="min-h-screen"
              clouds={"typicalClouds"}
            >
              <WhatOthersAreBuildingSection />
            </BackgroundWrapper>
          </div>
        </div>
      </AppLayout>
    </ProtectedPage>
  );
}
