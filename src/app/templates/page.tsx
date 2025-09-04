//src/app/templates/page.tsx
"use client";

import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { ProtectedPage } from "@/components/ProtectedPage";
import BackgroundWrapper from "@/components/ui/BackgroundWrapper";
import HeroSection from "@/components/ui/HeroSection";
import HeroHeading from "@/components/ui/HeroHeading";
import HeroSubtitle from "@/components/ui/HeroSubtitle";

export default function TemplatesPage() {
  return (
    <ProtectedPage>
      <AppLayout>
        <div className="flex-1 relative overflow-y-auto">
          <BackgroundWrapper className="min-h-screen">
            <HeroSection className="h-full flex items-center justify-center">
              <div className="text-center max-w-4xl mx-auto px-6">
                <HeroHeading size="lg" className="mb-8">
                  Templates
                </HeroHeading>

                <div className="relative bg-gradient-to-br from-purple-100/60 via-white/60 to-blue-100/60 border border-purple-200/40 shadow-xl rounded-3xl p-12 overflow-hidden">
                  <div className="absolute inset-0 pointer-events-none">
                    <svg
                      className="w-full h-full"
                      viewBox="0 0 400 200"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="320"
                        cy="40"
                        r="80"
                        fill="#a78bfa"
                        fillOpacity="0.15"
                      />
                      <circle
                        cx="80"
                        cy="160"
                        r="60"
                        fill="#818cf8"
                        fillOpacity="0.12"
                      />
                      <circle
                        cx="200"
                        cy="100"
                        r="100"
                        fill="#f472b6"
                        fillOpacity="0.07"
                      />
                    </svg>
                  </div>
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-6">
                      <span className="text-gray-600 tracking-wide select-none text-2xl drop-shadow-sm">
                        Coming Soon
                      </span>
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-gray-800 mb-3 drop-shadow-sm">
                      Discover & Remix Community Creations
                    </div>
                    <div className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl text-center">
                      Soon you'll be able to explore the creative clones our
                      community is building.
                      <br />
                      <span className="inline-block mt-2 text-purple-600 font-regular drop-shadow-sm">
                        Find inspiration, remix ideas, and level up your craft.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </HeroSection>
          </BackgroundWrapper>
        </div>
      </AppLayout>
    </ProtectedPage>
  );
}
