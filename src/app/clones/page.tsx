//src/app/clones/page.tsx
"use client";

import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import StudioHeader from "@/components/ui/StudioHeader";
import { useSidebarNavigation } from "@/hooks/useSidebarNavigation";
import Button from "@/components/ui/Button";
import GradientBorderBox from "@/components/ui/GradientBorderBox";
import Avatar from "@/components/ui/Avatar";
import { ProtectedPage } from "@/components/ProtectedPage";

export default function ClonesPage() {
  const navigationItems = useSidebarNavigation();

  const recentItems = [
    { id: "1", name: "AI Assistant 1" },
    { id: "2", name: "AI Assistant 2" },
    { id: "3", name: "AI Assistant 3" },
  ];

  type CloneTemplate = {
    id: string;
    name: string;
    role: string;
    status: "Ready" | "In Progress" | "Draft";
    tags: string[];
    updatedAt: string;
    description: string;
    imageUrl?: string;
  };

  const cloneTemplates: CloneTemplate[] = [
    {
      id: "1",
      name: "Olivia Rhye",
      role: "Marketing expert",
      status: "Ready",
      tags: ["Tag 1", "Tag 2", "Tag 3"],
      updatedAt: "1 hr ago",
      description: "Review your clone’s completion status before publishing",
    },
    {
      id: "2",
      name: "Dpril Aunford",
      role: "Marketing expert",
      status: "Ready",
      tags: ["Tag 1", "Tag 2", "Tag 3"],
      updatedAt: "2 hrs ago",
      description: "Review your clone’s completion status before publishing",
    },
    {
      id: "3",
      name: "Shubham Kumar",
      role: "Customer Support",
      status: "Ready",
      tags: ["Tag 1", "Tag 2", "Tag 3"],
      updatedAt: "Yesterday",
      description: "Review your clone’s completion status before publishing",
    },
    {
      id: "4",
      name: "Utkarsh Chandel",
      role: "Product Manager",
      status: "Ready",
      tags: ["Tag 1", "Tag 2", "Tag 3"],
      updatedAt: "2 days ago",
      description: "Review your clone’s completion status before publishing",
    },
  ];

  return (
    <ProtectedPage>
      <AppLayout>
        <div className="flex-1 relative overflow-y-auto bg-gray-50">
          <StudioHeader />
          <div className="p-8">
            {/* Breadcrumbs */}
            <div className="text-[13px] text-gray-500 mb-6">
              Home <span className="text-gray-400">›</span> My Clones
              <span className="text-gray-400"> ›</span> Clone Templates
            </div>

            {/* Header row: Title + actions */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-[#383838] tracking-tight">
                  Clone Templates
                </h2>
                <p className="text-sm text-[#484848]">
                  Review your clone’s completion status before publishing
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="secondary">Explore Templates</Button>
                <Button variant="gradient">Create New Clone</Button>
              </div>
            </div>

            {/* Grid of clone cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mb-10">
              {cloneTemplates.map((ct) => (
                <GradientBorderBox key={ct.id} innerClassName="p-4">
                  <div className="flex items-start justify-between">
                    <Avatar name={ct.name} role={ct.role} size="md" />
                    <span className="px-2 py-0.5 rounded-[10px] text-[14px] leading-4 text-[#34a853] bg-[#f4f4f4] border border-[rgba(52,168,83,0.3)]">
                      {ct.status}
                    </span>
                  </div>

                  <div className="my-4 h-px bg-[#efefef]" />

                  <p className="text-[14px] text-[#616161]">{ct.description}</p>

                  <div className="mt-4 flex gap-2">
                    {ct.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 rounded-md border border-[rgba(130,130,130,0.15)] text-[#828282] text-[14px]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-3 text-[10px] italic text-[#717680]">
                    Last Updated: {ct.updatedAt}
                  </div>
                </GradientBorderBox>
              ))}
            </div>

            {/* Divider */}
            {/* <div className="h-px bg-gray-200 mb-8" /> */}

            {/* Danger Zone */}
            {/* <div className="mb-4">
            <h3 className="text-2xl font-semibold text-[#383838] tracking-tight">
              Danger Zone
            </h3>
            <p className="text-sm text-[#484848]">
              Irreversible actions for all clones.
            </p>
          </div> */}
            {/* <div className="flex items-start justify-between gap-4 border border-red-500/60 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="shrink-0 w-[33px] h-[33px] bg-white border rounded-lg" />
              <div>
                <div className="text-[16px] text-[#3f3f3f] font-medium">
                  Delete All Clones
                </div>
                <div className="text-[14px] text-[#9c9c9c]">
                  Permanently delete all clones and all its data
                </div>
              </div>
            </div>
            <Button variant="danger">Delete Clones</Button>
          </div> */}
          </div>
        </div>
      </AppLayout>
    </ProtectedPage>
  );
}
