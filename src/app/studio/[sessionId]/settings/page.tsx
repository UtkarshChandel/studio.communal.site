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
import { EditableSessionHeader } from "@/components/ui/SettingsProfileHeader";
import { ProtectedPage } from "@/components/ProtectedPage";
import { useToastStore } from "@/store/useToastStore";
import {
  generatePublicUrl as generatePublicUrlFn,
  fetchPublishingStatus,
  publishSession,
  unpublishSession,
} from "@/lib/sessions";
import { useUserStore } from "@/store/useUserStore";
import { useSessionStore } from "@/store/useSessionStore";

export default function SessionSettingsPage() {
  const params = useParams<{ sessionId: string }>();
  const sessionId = params?.sessionId as string;
  // Hydrate from session store if available (populated by listSessions)
  const sessionInStore = useSessionStore((state) =>
    state.sessions.find((s) => s.id === sessionId)
  );
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
  const [publishingSession, setPublishingSession] =
    React.useState<boolean>(false);
  const [publishError, setPublishError] = React.useState<string>("");
  const { addToast } = useToastStore();
  const tabs = [
    { value: "published", label: "Share" },
    { value: "configure", label: "Configure" },
    { value: "monetise", label: "Monetise" },
    { value: "feedback", label: "Feedback" },
    { value: "analytics", label: "Analytics" },
  ];

  // Keep in sync with store updates (when sessions load later)
  React.useEffect(() => {
    const unsub = useSessionStore.subscribe((state) => {
      const s = state.sessions.find((x) => x.id === sessionId);
      if (!s) return;
      if (typeof s.name === "string") setName(s.name);
      if (typeof s.description === "string") setDescription(s.description);
      if (Array.isArray(s.tags)) setTags(s.tags);
    });
    return () => unsub();
  }, [sessionId]);

  // Handle publish/unpublish actions
  const handlePublishAction = async () => {
    if (!sessionId || publishingSession) return;

    try {
      setPublishingSession(true);
      setPublishError(""); // Clear previous errors
      // const user = useUserStore.getState().user; // Currently unused
      const currentSession = sessionInStore;

      if (currentSession?.isPublished) {
        // Unpublish session
        await unpublishSession(sessionId);
        // Update session store
        useSessionStore
          .getState()
          .updateSession(sessionId, { isPublished: false });
      } else {
        // Publish session (this will check isReadyToPublish first)
        await publishSession(sessionId);
        // Update session store
        useSessionStore
          .getState()
          .updateSession(sessionId, { isPublished: true });
      }
    } catch (error: unknown) {
      console.error("Failed to update publishing status:", error);
      setPublishError(
        error instanceof Error
          ? error.message
          : "Failed to update publishing status"
      );
    } finally {
      setPublishingSession(false);
    }
  };

  // Generate public URL
  const generatePublicUrl = () => {
    if (!sessionInStore?.isPublished) return "";
    const user = useUserStore.getState().user;
    return generatePublicUrlFn(
      user?.name || "user",
      sessionInStore?.name || "session",
      sessionId
    );
  };

  // Load publishing status on mount
  React.useEffect(() => {
    const loadPublishingStatus = async () => {
      if (!sessionId) return;
      try {
        setLoadingStatus(true);
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
                      title="Share Your Clone"
                      subtitle="Choose how you want to distribute your clone"
                      className="font-inter"
                    />
                    <div className="space-y-4">
                      <SettingsOptionCard
                        icon={<FigmaLinkIcon className="w-6 h-6" />}
                        title="Generate Public Link"
                        description="Create a shareable link for anyone to try your clone"
                        linkUrl={
                          sessionInStore?.isPublished
                            ? generatePublicUrl()
                            : undefined
                        }
                        onCopyLink={
                          sessionInStore?.isPublished
                            ? () => {
                                const url = generatePublicUrl();
                                if (url) {
                                  navigator.clipboard.writeText(url);
                                  addToast({
                                    message: "Copied",
                                    type: "success",
                                    duration: 2000,
                                  });
                                }
                              }
                            : undefined
                        }
                        extraAction={
                          sessionInStore?.isPublished
                            ? {
                                label: publishingSession
                                  ? "Unpublishing..."
                                  : "Unpublish",
                                onClick: handlePublishAction,
                                variant: "danger",
                              }
                            : undefined
                        }
                        primaryAction={
                          !sessionInStore?.isPublished
                            ? {
                                label: publishingSession
                                  ? "Generating..."
                                  : "Generate Link",
                                onClick: handlePublishAction,
                                variant: "secondary",
                              }
                            : undefined
                        }
                      />
                      {publishError && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-4">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <svg
                                className="h-5 w-5 text-red-400"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm text-red-800">
                                {publishError}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
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
