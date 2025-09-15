import React, { useState, useRef, useEffect } from "react";
import AIMessage from "./AIMessage";
import HumanMessage from "./HumanMessage";
import ChatInputTextArea from "./ChatInputTextArea";
import FileUploadModal from "./FileUploadModal";
import { logger } from "@/lib/logger";

export interface Message {
  id: string;
  type: "ai" | "human";
  content: string;
  timestamp: Date;
  userName?: string;
  userAvatar?: string;
}

interface ChatWindowProps {
  messages?: Message[];
  onSendMessage?: (message: string) => void;
  placeholder?: string;
  className?: string;
  showMessageActions?: boolean;
  userName?: string;
  userAvatar?: string;
  generating?: boolean;
  onStop?: () => void;
  onReachTop?: () => void | Promise<void>;
  loadingTop?: boolean;
  scrollToBottomSignal?: number;
  showEmptyPlaceholder?: boolean;
  disabled?: boolean;
  sessionId?: string;
}

export default function ChatWindow({
  messages = [],
  onSendMessage,
  placeholder = "What expertise are we scaling today?",
  className = "",
  showMessageActions = true,
  userName = "You",
  userAvatar,
  generating = false,
  onStop,
  onReachTop,
  loadingTop = false,
  scrollToBottomSignal,
  showEmptyPlaceholder = true,
  disabled = false,
  sessionId,
}: ChatWindowProps) {
  logger.component("ChatWindow", "render - messages count:", messages.length);
  logger.component("ChatWindow", "render - messages:", messages);
  logger.component("ChatWindow", "render - generating:", generating);
  const [isLoading, setIsLoading] = useState(false);
  const [isFileUploadModalOpen, setIsFileUploadModalOpen] = useState(false);
  // const [isStreaming, setIsStreaming] = useState(false); // Unused
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevTopRef = useRef<number>(0);
  const prevHeightRef = useRef<number>(0);
  const wasLoadingTopRef = useRef<boolean>(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Preserve scroll position when prepending older messages
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (loadingTop && !wasLoadingTopRef.current) {
      prevTopRef.current = el.scrollTop;
      prevHeightRef.current = el.scrollHeight;
      wasLoadingTopRef.current = true;
    }
  }, [loadingTop]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (wasLoadingTopRef.current && !loadingTop) {
      const newHeight = el.scrollHeight;
      const delta = newHeight - (prevHeightRef.current || 0);
      el.scrollTop = (prevTopRef.current || 0) + delta;
      wasLoadingTopRef.current = false;
      return;
    }
    // Auto-scroll only if user is near the bottom or we are generating
    const nearBottom = el.scrollHeight - (el.scrollTop + el.clientHeight) < 80;
    if (generating || isLoading || nearBottom) {
      scrollToBottom();
    }
  }, [messages, generating, isLoading, loadingTop]);

  // Explicit scroll-to-bottom requests (e.g., after initial history load)
  useEffect(() => {
    if (scrollToBottomSignal !== undefined) {
      scrollToBottom();
    }
  }, [scrollToBottomSignal]);

  const handleSendMessage = async (message: string) => {
    if (onSendMessage) {
      setIsLoading(true);
      try {
        onSendMessage(message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleLikeMessage = (messageId: string) => {
    console.log("Liked message:", messageId);
  };

  const handleDislikeMessage = (messageId: string) => {
    console.log("Disliked message:", messageId);
  };

  const handleCopyMessage = (messageId: string) => {
    console.log("Copied message:", messageId);
  };

  const handleOpenFileUpload = () => {
    setIsFileUploadModalOpen(true);
  };

  const handleCloseFileUpload = () => {
    setIsFileUploadModalOpen(false);
  };

  const handleFileUpload = (files: File[]) => {
    logger.component("ChatWindow", "Files uploaded:", files);
    // TODO: Implement actual file upload logic here
    console.log("Files to upload:", files);
  };

  return (
    <div
      className={`relative flex font-inter flex-col h-full bg-white rounded-[20px] shadow-xl border border-gray-200 ${className}`}
    >
      {/* Chat Messages Area - now takes full height and has bottom padding */}
      <div
        className="flex-1 overflow-y-auto p-6 space-y-4 pb-48"
        onScroll={(e) => {
          const el = e.currentTarget as HTMLElement;
          if (el.scrollTop <= 0) {
            onReachTop?.();
          }
        }}
        ref={containerRef}
      >
        {loadingTop && (
          <div className="space-y-3 mb-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={`top-skel-${i}`} className="animate-pulse">
                <div className="h-4 w-20 bg-gray-200 rounded mb-2" />
                <div className="h-12 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        )}
        {messages.length === 0 ? (
          showEmptyPlaceholder ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-5 w-24 bg-gray-200 rounded mb-2" />
                  <div className="h-16 bg-gray-100 rounded" />
                </div>
              ))}
            </div>
          ) : null
        ) : (
          <>
            {messages.map((message, idx) => {
              logger.component(
                "ChatWindow",
                "rendering message:",
                message.id,
                message.type,
                "content length:",
                message.content?.length
              );
              return (
                <div key={message.id}>
                  {message.type === "ai" ? (
                    <AIMessage
                      message={message.content}
                      showActions={showMessageActions}
                      showCaret={generating && idx === messages.length - 1}
                      onLike={() => handleLikeMessage(message.id)}
                      onDislike={() => handleDislikeMessage(message.id)}
                      onCopy={() => handleCopyMessage(message.id)}
                    />
                  ) : (
                    <HumanMessage
                      message={message.content}
                      userName={message.userName || userName}
                      userAvatar={message.userAvatar || userAvatar}
                    />
                  )}
                </div>
              );
            })}
            {isLoading && (
              <div className="flex items-center space-x-2 text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
                <span className="text-sm">Thinking...</span>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Area - now positioned absolutely to overlay the messages */}
      <div
        className="absolute bottom-0 left-0 right-0 p-3 mt-5"
        style={{
          background: "rgba(255, 255, 255, 0.4)", // Medium transparency
          backdropFilter: "blur(50px)",
          WebkitBackdropFilter: "blur(50px)",
          borderTop: "1px solid rgba(255, 255, 255, 0.3)",
          borderRadius: "0 0 20px 20px",
        }}
      >
        <ChatInputTextArea
          onSubmit={handleSendMessage}
          placeholder={placeholder}
          loading={isLoading}
          generating={generating}
          onStop={onStop}
          disabled={disabled}
          onFileUpload={handleOpenFileUpload}
        />
      </div>

      {/* File Upload Modal */}
      <FileUploadModal
        isOpen={isFileUploadModalOpen}
        onClose={handleCloseFileUpload}
        onFileUpload={handleFileUpload}
        sessionId={sessionId}
      />
    </div>
  );
}
