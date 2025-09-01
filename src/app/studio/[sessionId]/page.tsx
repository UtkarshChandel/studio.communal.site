"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";
import StudioHeader from "@/components/ui/StudioHeader";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import ChatWindow, { Message } from "@/components/ui/ChatWindow";
import { ProtectedPage } from "@/components/ProtectedPage";
import { useSessionStore } from "@/store/useSessionStore";
import { useUserStore } from "@/store/useUserStore";
import { logger } from "@/lib/logger";
import { streamInterviewerMessage } from "@/lib/chat";
import {
  fetchSessionHistory,
  BackendHistoryItem,
  HistoryWindow,
} from "@/lib/sessions";

export default function StudioSessionPage() {
  const params = useParams<{ sessionId: string }>();
  const router = useRouter();
  const setActive = useSessionStore((s) => s.setActiveSession);
  const sessions = useSessionStore((s) => s.sessions);
  const currentSession = sessions.find((s) => s.id === params?.sessionId);

  React.useEffect(() => {
    if (params?.sessionId) setActive(params.sessionId);
  }, [params?.sessionId, setActive]);

  const [chatMessages, setChatMessages] = React.useState<Message[]>([]);

  const user = useUserStore((s) => s.user);
  const earliestIdRef = React.useRef<string | null>(null);
  const loadingHistoryRef = React.useRef<boolean>(false);
  const [loadingTop, setLoadingTop] = React.useState<boolean>(false);
  const [scrollSignal, setScrollSignal] = React.useState<number>(0);
  const [showEmptyPlaceholder, setShowEmptyPlaceholder] =
    React.useState<boolean>(true);
  const hasBeforeRef = React.useRef<boolean>(true);

  const mapHistory = React.useCallback(
    (items: BackendHistoryItem[]): Message[] => {
      return (items || []).map((it) => {
        const roleRaw = (it.role ?? it.type ?? "").toString().toLowerCase();
        const isAssistant = roleRaw === "assistant";
        return {
          id: it.id,
          type: isAssistant ? "ai" : "human",
          content: it.text ?? it.content ?? "",
          timestamp: new Date(it.createdAt || Date.now()),
          userName: isAssistant ? undefined : user?.name || "You",
        } as Message;
      });
    },
    [user?.name]
  );

  const loadInitialHistory = React.useCallback(
    async (sid: string) => {
      try {
        const windowData: HistoryWindow = await fetchSessionHistory(sid, {
          limit: 10,
          includeAssistant: true,
        });
        const mapped = mapHistory(windowData.items);
        // Decide whether to show skeleton/placeholder based on page window
        const hasAnyWindow = Boolean(
          (windowData.items && windowData.items.length > 0) ||
            windowData.page?.hasBefore ||
            windowData.page?.hasAfter
        );
        setShowEmptyPlaceholder(hasAnyWindow);
        if (mapped.length > 0) {
          earliestIdRef.current = windowData.page.firstId || mapped[0].id;
          hasBeforeRef.current = Boolean(windowData.page?.hasBefore);
          setChatMessages(mapped);
          setTimeout(() => setScrollSignal((s) => s + 1), 0);
        }
      } catch {}
    },
    [mapHistory]
  );

  React.useEffect(() => {
    const sid = params?.sessionId as string;
    if (!sid) return;
    let cancelled = false;
    (async () => {
      try {
        await loadInitialHistory(sid);
      } finally {
        if (cancelled) return;
        try {
          const key = `pendingMessage:${sid}`;
          const pending = sessionStorage.getItem(key);
          if (pending && pending.trim().length > 0) {
            sessionStorage.removeItem(key);
            // Send after a micro delay to ensure the component tree is fully ready
            setTimeout(() => {
              if (!cancelled) void handleSendMessage(pending);
            }, 0);
          }
        } catch {}
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [params?.sessionId, loadInitialHistory]);
  const streamRef = React.useRef<{ stop: () => void } | null>(null);
  const [streamingAiId, setStreamingAiId] = React.useState<string | null>(null);
  const typeBufferRef = React.useRef<string>("");
  const typingTimerRef = React.useRef<ReturnType<typeof setInterval> | null>(
    null
  );
  const streamDoneRef = React.useRef<boolean>(false);

  const startTypingLoop = React.useCallback((aiId: string) => {
    if (typingTimerRef.current) return;
    typingTimerRef.current = setInterval(() => {
      const buf = typeBufferRef.current;
      if (buf && buf.length > 0) {
        const nextChar = buf[0];
        typeBufferRef.current = buf.slice(1);
        logger.chat(
          "Typing character:",
          nextChar,
          "remaining buffer:",
          typeBufferRef.current
        );
        setChatMessages((prev) =>
          prev.map((m) =>
            m.id === aiId ? { ...m, content: (m.content || "") + nextChar } : m
          )
        );
      } else if (streamDoneRef.current) {
        logger.chat("Typing loop finished, cleaning up");
        if (typingTimerRef.current) {
          clearInterval(typingTimerRef.current);
          typingTimerRef.current = null;
        }
        setStreamingAiId(null);
      }
    }, 20); // 20ms per character for linear typing effect
  }, []);
  const handleSendMessage = async (message: string) => {
    // If a stream is already active, stop it gracefully before starting a new one
    if (streamingAiId) {
      try {
        streamRef.current?.stop();
      } catch {}
      streamRef.current = null;
      typeBufferRef.current = "";
      streamDoneRef.current = true;
      if (typingTimerRef.current) {
        clearInterval(typingTimerRef.current);
        typingTimerRef.current = null;
      }
      setStreamingAiId(null);
    }
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "human",
      content: message,
      timestamp: new Date(),
      userName: "Sneha",
    };
    setChatMessages((prev) => [...prev, userMessage]);
    // Start streaming from backend
    const sessionId = params?.sessionId as string;
    const aiId = `${Date.now()}-ai`;
    const newAiMessage = {
      id: aiId,
      type: "ai" as const,
      content: "",
      timestamp: new Date(),
    };
    logger.chat("Creating AI message:", newAiMessage);
    setChatMessages((prev) => {
      const updated = [...prev, newAiMessage];
      logger.chat("Updated chat messages:", updated);
      return updated;
    });
    // reset streaming helpers
    typeBufferRef.current = "";
    streamDoneRef.current = false;
    startTypingLoop(aiId);
    const sub = streamInterviewerMessage(
      sessionId,
      message,
      user?.name || "default",
      {
        onDelta: (chunk) => {
          logger.chat("Studio onDelta received chunk:", chunk);
          logger.chat("Current typeBuffer:", typeBufferRef.current);

          // TEMPORARY: Direct update to test if typing animation is the issue
          setChatMessages((prev) => {
            const updated = prev.map((m) =>
              m.id === aiId ? { ...m, content: (m.content || "") + chunk } : m
            );
            logger.chat("Direct update - looking for aiId:", aiId);
            logger.chat(
              "Direct update - found message:",
              updated.find((m) => m.id === aiId)
            );
            logger.chat("Direct update - all messages:", updated);
            return updated;
          });

          // If, for any reason, the typing loop hasn't started yet, start it lazily
          if (!typingTimerRef.current) {
            logger.chat("Starting typing loop for aiId:", aiId);
            startTypingLoop(aiId);
          }
          // Ensure generating state becomes true ASAP for caret visibility
          if (!streamingAiId) {
            logger.chat("Setting streaming AI ID:", aiId);
            setStreamingAiId(aiId);
          }
          typeBufferRef.current += chunk;
          logger.chat("Updated typeBuffer:", typeBufferRef.current);
        },
        onError: () => {
          // treat as done to update UI
          streamDoneRef.current = true;
        },
        onDone: (finalText?: string) => {
          // First, flush any remaining buffered characters accumulated by the typing loop
          if (typeBufferRef.current && typeBufferRef.current.length > 0) {
            const remaining = typeBufferRef.current;
            typeBufferRef.current = "";
            setChatMessages((prev) =>
              prev.map((m) =>
                m.id === aiId
                  ? { ...m, content: (m.content || "") + remaining }
                  : m
              )
            );
          }
          // If backend provided a final aggregated answer, replace content with it
          if (typeof finalText === "string" && finalText.length > 0) {
            setChatMessages((prev) =>
              prev.map((m) =>
                m.id === aiId ? { ...m, content: finalText } : m
              )
            );
          }
          streamDoneRef.current = true;
        },
      }
    );
    streamRef.current = sub;
    setStreamingAiId(aiId);
  };

  return (
    <ProtectedPage>
      <AppLayout>
        <div className="flex-1 relative overflow-y-auto bg-gray-50">
          <StudioHeader />
          <div className="p-8">
            <div className="w-full">
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  <Avatar
                    name={
                      currentSession?.name || `Session ${params?.sessionId}`
                    }
                    role="Interviewer"
                    showOnlineStatus={true}
                    badge={{ text: "Training", color: "orange" }}
                    onClick={() => console.log("Clicked Session Avatar")}
                  />
                  <div className="flex gap-4">
                    <button
                      onClick={() =>
                        router.push(`/studio/${params?.sessionId}/settings`)
                      }
                      aria-label="Settings"
                      className="cursor-pointer bg-transparent border-none p-0 m-0"
                      type="button"
                    >
                      <span className="sr-only">Settings</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-10 w-10 text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.527-.94 3.31.843 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.527-.843 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.527.94-3.31-.843-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.527.843-3.31 2.37-2.37.996.614 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </button>
                    {/* <Button variant="secondary">Try</Button> */}
                    <Button
                      variant="gradient"
                      onClick={() =>
                        router.push(`/studio/${params?.sessionId}/settings`)
                      }
                    >
                      Publish
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mb-8 flex-1">
                <div className="h-[calc(100vh-300px)] min-h-[600px]">
                  <ChatWindow
                    messages={chatMessages}
                    onSendMessage={handleSendMessage}
                    placeholder="What expertise are we scaling today?"
                    userName="Sneha"
                    showMessageActions={true}
                    showEmptyPlaceholder={showEmptyPlaceholder}
                    // wire stop button and caret

                    generating={
                      Boolean(streamingAiId) || typeBufferRef.current.length > 0
                    }
                    onStop={() => {
                      streamRef.current?.stop();
                      streamRef.current = null;
                      typeBufferRef.current = "";
                      streamDoneRef.current = true;
                      if (typingTimerRef.current) {
                        clearInterval(typingTimerRef.current);
                        typingTimerRef.current = null;
                      }
                      setStreamingAiId(null);
                    }}
                    onReachTop={async () => {
                      if (loadingHistoryRef.current) return;
                      const sid = params?.sessionId as string;
                      if (
                        !sid ||
                        !earliestIdRef.current ||
                        !hasBeforeRef.current
                      )
                        return;
                      try {
                        loadingHistoryRef.current = true;
                        setLoadingTop(true);
                        const olderWindow: HistoryWindow =
                          await fetchSessionHistory(sid, {
                            limit: 10,
                            includeAssistant: true,
                            anchorMessageId: earliestIdRef.current,
                            direction: "before",
                          });
                        const mapped = mapHistory(olderWindow.items);
                        if (mapped.length > 0) {
                          earliestIdRef.current =
                            olderWindow.page.firstId || mapped[0].id;
                          hasBeforeRef.current = Boolean(
                            olderWindow.page?.hasBefore
                          );
                          setChatMessages((prev) => [...mapped, ...prev]);
                        }
                      } finally {
                        loadingHistoryRef.current = false;
                        setLoadingTop(false);
                      }
                    }}
                    loadingTop={loadingTop}
                    scrollToBottomSignal={scrollSignal}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    </ProtectedPage>
  );
}
