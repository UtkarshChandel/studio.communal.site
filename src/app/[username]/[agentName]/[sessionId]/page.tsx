"use client";

import React from "react";
import { useParams } from "next/navigation";
import ChatWindow, { Message } from "@/components/ui/ChatWindow";
import Avatar from "@/components/ui/Avatar";
import {
  createConsultantSession,
  streamConsultantMessage,
  ConsultantSession,
} from "@/lib/consultant";
import { useMessageLimit } from "@/hooks/useMessageLimit";
import MessageLimitBanner from "@/components/ui/MessageLimitBanner";

// Public Header Component
function PublicHeader() {
  return (
    <div className="bg-white border-b border-[#e6e8eb] h-14 sticky top-0 z-10">
      <div className="max-w-screen-xl mx-auto px-4 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Communal AI" className="h-8 w-8" />
            <span className="text-[#424242] text-sm font-semibold tracking-[-0.2px]">
              Communal AI
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Page Component
export default function PublicConsultantPage() {
  const params = useParams<{
    username: string;
    agentName: string;
    sessionId: string;
  }>();

  const [consultantSession, setConsultantSession] =
    React.useState<ConsultantSession | null>(null);
  const [isInitializing, setIsInitializing] = React.useState(true);
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: "1",
      type: "ai" as const,
      content: "Hey there, Let's get started.\nHow can I help you today?",
      timestamp: new Date(),
    },
  ]);

  const [isGenerating, setIsGenerating] = React.useState(false);
  const [currentStreamCleanup, setCurrentStreamCleanup] = React.useState<
    (() => void) | null
  >(null);

  // Message limit hook
  const {
    isLimitReached,
    remainingMessages,
    timeUntilReset,
    canSendMessage,
    incrementCount,
    messageCount,
    messageLimit,
  } = useMessageLimit();

  // Create consultant session on mount
  React.useEffect(() => {
    const initializeSession = async () => {
      if (!params?.sessionId) return;

      try {
        setIsInitializing(true);
        const session = await createConsultantSession(params.sessionId);
        setConsultantSession(session);
      } catch (error) {
        console.error("Failed to create consultant session:", error);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeSession();
  }, [params?.sessionId]);

  // Cleanup stream on unmount
  React.useEffect(() => {
    return () => {
      if (currentStreamCleanup) {
        currentStreamCleanup();
      }
    };
  }, [currentStreamCleanup]);

  const handleSendMessage = async (content: string) => {
    if (!consultantSession) {
      console.error("No consultant session available");
      return;
    }

    // Check message limit before sending
    if (!canSendMessage()) {
      console.log("Message limit reached");
      return;
    }

    // Stop any existing stream
    if (currentStreamCleanup) {
      currentStreamCleanup();
      setCurrentStreamCleanup(null);
    }

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: "human" as const,
      content,
      timestamp: new Date(),
      userName: params.username
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase()),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsGenerating(true);

    // Increment message count
    incrementCount();

    // Create placeholder AI message for streaming
    const aiMessageId = `ai-${Date.now()}`;
    const aiMessage: Message = {
      id: aiMessageId,
      type: "ai" as const,
      content: "",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, aiMessage]);

    let accumulatedContent = "";

    // Start streaming
    const cleanup = streamConsultantMessage(
      consultantSession.id,
      content,
      (event) => {
        switch (event.type) {
          case "start":
            break;
          case "delta":
            accumulatedContent +=
              (typeof event.data === "string" ? event.data : "") || "";
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === aiMessageId
                  ? { ...msg, content: accumulatedContent }
                  : msg
              )
            );
            break;
          case "tool_start":
          case "tool_end":
            console.log("Tool event:", event.type, event.data);
            break;
          case "final":
            accumulatedContent =
              (typeof event.data === "string" ? event.data : null) ||
              accumulatedContent;
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === aiMessageId
                  ? { ...msg, content: accumulatedContent }
                  : msg
              )
            );
            break;
          case "end":
            setIsGenerating(false);
            setCurrentStreamCleanup(null);
            break;
          case "error":
            console.error("Streaming error:", event.data);
            setIsGenerating(false);
            setCurrentStreamCleanup(null);
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === aiMessageId
                  ? {
                      ...msg,
                      content:
                        "Sorry, I encountered an error. Please try again.",
                    }
                  : msg
              )
            );
            break;
        }
      },
      (error) => {
        console.error("Stream connection error:", error);
        setIsGenerating(false);
        setCurrentStreamCleanup(null);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId
              ? {
                  ...msg,
                  content: "Sorry, I couldn't connect. Please try again.",
                }
              : msg
          )
        );
      },
      () => {
        setIsGenerating(false);
        setCurrentStreamCleanup(null);
      }
    );

    setCurrentStreamCleanup(() => cleanup);
  };

  const handleStopGeneration = () => {
    if (currentStreamCleanup) {
      currentStreamCleanup();
      setCurrentStreamCleanup(null);
    }
    setIsGenerating(false);
  };

  if (!params) {
    return <div>Loading...</div>;
  }

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-[#fbfcfd] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing consultation session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfcfd]">
      <PublicHeader />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Avatar
            name={`Ask ${params.agentName
              .replace(/-/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase())}`}
            role={params.username
              .replace(/-/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase())}
            showOnlineStatus={true}
          />
        </div>

        {/* Message Limit Banner */}
        <MessageLimitBanner
          remainingMessages={remainingMessages}
          timeUntilReset={timeUntilReset}
          isLimitReached={isLimitReached}
          messageCount={messageCount}
          messageLimit={messageLimit}
        />

        <div className="h-[calc(100vh-300px)] min-h-[600px]">
          <ChatWindow
            messages={messages}
            onSendMessage={handleSendMessage}
            placeholder="What expertise are we scaling today?"
            userName={params.username
              .replace(/-/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase())}
            showMessageActions={true}
            generating={isGenerating}
            onStop={handleStopGeneration}
            showEmptyPlaceholder={false}
            disabled={isLimitReached}
          />
        </div>
      </div>

      <div className="fixed bottom-20 right-6">
        <button className="w-7 h-7 bg-[#f1f3f5] rounded-full shadow-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
          <span className="text-gray-600 text-sm">?</span>
        </button>
      </div>
    </div>
  );
}
