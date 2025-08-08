"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/ui/Sidebar";
import StudioHeader from "@/components/ui/StudioHeader";
import { useSidebarNavigation } from "@/hooks/useSidebarNavigation";
import MetricCard from "@/components/ui/MetricCard";
import SettingsOptionCard from "@/components/ui/SettingsOptionCard";
import SettingsSectionHeader from "@/components/ui/SettingsSectionHeader";
import Button from "@/components/ui/Button";
import FigmaLinkIcon from "@/components/ui/icons/LinkIcon";

export default function AgentSettingsPage() {
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
        userName="sneha Gupta"
        workspaceName="My Workspace"
        workspaces={["My Workspace", "Team Workspace", "Client Workspace"]}
        navigationItems={navigationItems}
        recentItems={recentItems}
        onWorkspaceChange={(workspace) =>
          console.log("Workspace changed to:", workspace)
        }
      />

      {/* Main Content Area */}
      <div className="flex-1 relative overflow-y-auto bg-white">
        {/* Header */}
        <StudioHeader />

        {/* Content */}
        <div className="p-8">
          <div className="max-w-[1200px] mx-auto space-y-10">
            {/* Clone Readiness Status */}
            <SettingsSectionHeader
              title="Clone Readiness Status"
              subtitle="Review your clone’s completion status before publishing"
              className="font-inter"
            />
            {/* Top metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <MetricCard
                title="Topics Covered"
                value={10}
                subtitle="Auto-calculated as per your training"
                className="font-inter"
              />
              <MetricCard
                title="Test Interactions"
                value={5}
                subtitle="Internal testing sessions"
              />
              <MetricCard
                title="Overall Status"
                statusBadge={{ label: "Ready", colorClass: "bg-[#49bc43]" }}
                subtitle="Overall Status"
              />
            </div>

            {/* Share Your Clone */}
            <div>
              <SettingsSectionHeader
                title="Share Your Clone"
                subtitle="Choose how you want to distribute your clone"
                className="font-inter"
              />
              <div className="space-y-4">
                <SettingsOptionCard
                  icon={<FigmaLinkIcon className="w-6 h-6" />}
                  title="Generate Public Link"
                  description="Create a shareable link for anyone to try your clone"
                  linkUrl="https://communal.site/shubham/employee-onboarding-agent-x3gx6t3xt7x3gx6t3xtx3gx6t3xtx3gx6t3xt...."
                  onCopyLink={() =>
                    navigator.clipboard.writeText(
                      "https://communal.site/shubham/employee-onboarding-agent-x3gx6t3xt7x3gx6t3xtx3gx6t3xtx3gx6t3xt...."
                    )
                  }
                  extraAction={{
                    label: "Unpublish",
                    onClick: () => console.log("Unpublish"),
                    variant: "danger",
                  }}
                  primaryAction={{
                    label: "Generate Link",
                    onClick: () => console.log("Generate Link"),
                    variant: "secondary",
                  }}
                />
                <SettingsOptionCard
                  icon={<FigmaLinkIcon className="w-6 h-6" />}
                  title="Add to Consult AI"
                  description="Make your clone available in our browser extension (Slack → coming soon!)"
                  primaryAction={{
                    label: "Talk to Us",
                    onClick: () => console.log("Talk to Us"),
                    variant: "secondary",
                  }}
                  secondaryAction={{
                    label: "Install Extension",
                    onClick: () => console.log("Install Extension"),
                    variant: "gradient",
                  }}
                />
                <SettingsOptionCard
                  icon={<FigmaLinkIcon className="w-6 h-6" />}
                  title="Embed on Website"
                  description="Add your clone as a widget on any website"
                  primaryAction={{
                    label: "Talk to Us",
                    onClick: () => console.log("Talk to Us"),
                    variant: "secondary",
                  }}
                  secondaryAction={{
                    label: "Check Demo",
                    onClick: () => console.log("Check Demo"),
                    variant: "gradient",
                  }}
                />
              </div>
            </div>

            {/* Third-Party Integrations */}
            <div>
              <SettingsSectionHeader
                title="Third-Party Integrations"
                subtitle="Choose how you want to distribute your clone"
              />
              <div className="space-y-4">
                <SettingsOptionCard
                  title="Slack Integration"
                  description="Deploy clone to your Slack workspace (Coming Soon - Whitelist specific users)"
                  secondaryAction={{
                    label: "Add to Slack",
                    onClick: () => console.log("Add to Slack"),
                    variant: "gradient",
                  }}
                />
              </div>
            </div>

            {/* Configure Your Clone */}
            <div>
              <SettingsSectionHeader
                title="Configure Your Clone"
                subtitle="Adjust clone settings like audio/video, view performance, setup pricing & more"
              />
              <div className="flex justify-end">
                <Button
                  variant="gradient"
                  onClick={() => router.push("/studio")}
                >
                  Go to Clone Dashboard
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
