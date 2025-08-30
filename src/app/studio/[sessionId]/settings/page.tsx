"use client";

import React from "react";
import { useParams } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";
import StudioHeader from "@/components/ui/StudioHeader";
import MetricCard from "@/components/ui/MetricCard";
import SettingsOptionCard from "@/components/ui/SettingsOptionCard";
import SettingsSectionHeader from "@/components/ui/SettingsSectionHeader";
import FigmaLinkIcon from "@/components/ui/icons/LinkIcon";
import Tabs from "@/components/ui/Tabs";
import SettingsProfileHeader, {
  EditableSessionHeader,
} from "@/components/ui/SettingsProfileHeader";
import { ProtectedPage } from "@/components/ProtectedPage";

export default function SessionSettingsPage() {
  const params = useParams<{ sessionId: string }>();
  const sessionId = params?.sessionId as string;
  // Hydrate from session store if available (populated by listSessions)
  const { useSessionStore } = require("@/store/useSessionStore");
  const sessionInStore = useSessionStore
    .getState()
    .sessions.find((s: any) => s.id === sessionId);
  const [name, setName] = React.useState<string>(sessionInStore?.name || "");
  const [description, setDescription] = React.useState<string>(
    sessionInStore?.description || ""
  );
  const [tags, setTags] = React.useState<string[]>(sessionInStore?.tags || []);
  const [saving, setSaving] = React.useState<boolean>(false);
  const [activeTab, setActiveTab] = React.useState<string>("published");

  // Publishing status state
  const [publishingStatus, setPublishingStatus] = React.useState<{
    isReadyToPublish: boolean;
    nodes: number;
    relationships: number;
  } | null>(null);
  const [loadingStatus, setLoadingStatus] = React.useState<boolean>(false);
  const tabs = [
    { value: "published", label: "Published settings" },
    { value: "configure", label: "Configure" },
    { value: "monetise", label: "Monetise" },
    { value: "feedback", label: "Feedback" },
    { value: "analytics", label: "Analytics" },
  ];

  // Keep in sync with store updates (when sessions load later)
  React.useEffect(() => {
    const unsub = useSessionStore.subscribe((state: any) => {
      const s = state.sessions.find((x: any) => x.id === sessionId);
      if (!s) return;
      if (typeof s.name === "string") setName(s.name);
      if (typeof s.description === "string") setDescription(s.description);
      if (Array.isArray(s.tags)) setTags(s.tags);
    });
    return () => unsub();
  }, [sessionId]);

  // Load publishing status on mount
  React.useEffect(() => {
    const loadPublishingStatus = async () => {
      if (!sessionId) return;
      try {
        setLoadingStatus(true);
        const { fetchPublishingStatus } = require("@/lib/sessions");
        const status = await fetchPublishingStatus(sessionId);
        setPublishingStatus(status);
      } catch (error) {
        console.error("Failed to load publishing status:", error);
      } finally {
        setLoadingStatus(false);
      }
    };
    loadPublishingStatus();
  }, [sessionId]);

  return (
    <ProtectedPage>
      <AppLayout>
        <div className="flex-1 relative overflow-y-auto bg-white">
          <StudioHeader />
          <div className="p-8">
            <div className="max-w-[1200px] mx-auto">
              <EditableSessionHeader
                className="mb-6"
                sessionId={sessionId}
                name={name}
                onNameChange={setName}
                role={undefined}
                description={description}
                onDescriptionChange={setDescription}
                status={{ label: "Ready", variant: "success" }}
                tags={tags}
                onTagsChange={setTags}
                lastUpdatedText="Last Updated: 1 hr ago"
                avatar={{ initials: "DA", size: 86 }}
                saving={saving}
                setSaving={setSaving}
              />
              <div className="mb-4">
                <Tabs items={tabs} value={activeTab} onChange={setActiveTab} />
                <div className="h-0.5 bg-[#898de2] rounded-lg mt-2" />
              </div>

              {activeTab === "published" && (
                <div className="space-y-10">
                  <SettingsSectionHeader
                    title="Clone Readiness Status"
                    subtitle="Review your clone’s completion status before publishing"
                    className="font-inter"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <MetricCard
                      title="Topics Covered"
                      value={
                        loadingStatus ? "..." : publishingStatus?.nodes || 0
                      }
                      subtitle="Auto-calculated as per your training"
                      className="font-inter"
                    />
                    <MetricCard
                      title="Relationships"
                      value={
                        loadingStatus
                          ? "..."
                          : publishingStatus?.relationships || 0
                      }
                      subtitle="Internal testing sessions"
                    />
                    <MetricCard
                      title="Overall Status"
                      statusBadge={{
                        label: loadingStatus
                          ? "Loading..."
                          : publishingStatus?.isReadyToPublish
                          ? "Ready"
                          : "Not Ready",
                        colorClass: loadingStatus
                          ? "bg-gray-400"
                          : publishingStatus?.isReadyToPublish
                          ? "bg-[#49bc43]"
                          : "bg-red-500",
                      }}
                      subtitle="Overall Status"
                    />
                  </div>

                  <div>
                    <SettingsSectionHeader
                      title="Integrations"
                      subtitle="Choose how you want to integrate your clone"
                    />
                    <div className="space-y-4">
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
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "configure" && (
                <div className="text-gray-500">
                  Configure content coming soon.
                </div>
              )}
              {activeTab === "monetise" && (
                <div className="text-gray-500">
                  Monetise content coming soon.
                </div>
              )}
              {activeTab === "feedback" && (
                <div className="text-gray-500">
                  Feedback content coming soon.
                </div>
              )}
              {activeTab === "analytics" && (
                <div className="text-gray-500">
                  Analytics content coming soon.
                </div>
              )}
            </div>
          </div>
        </div>
      </AppLayout>
    </ProtectedPage>
  );
}
