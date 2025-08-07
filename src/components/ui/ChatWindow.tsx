import React, { useState, useRef, useEffect } from "react";
import AIMessage from "./AIMessage";
import HumanMessage from "./HumanMessage";
import { ChatInput } from "./ChatInput";

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
}

export default function ChatWindow({
  messages = [],
  onSendMessage,
  placeholder = "What expertise are we scaling today?",
  className = "",
  showMessageActions = true,
  userName = "You",
  userAvatar,
}: ChatWindowProps) {
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    if (onSendMessage) {
      setIsLoading(true);
      try {
        await onSendMessage(message);
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

  return (
    <div
      className={`flex flex-col h-full bg-white rounded-[5px] border border-gray-200 ${className}`}
    >
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p className="text-center">
              Hey there, Let's get started.
              <br />
              What expertise would you like to model in your AI self today?
            </p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div key={message.id}>
                {message.type === "ai" ? (
                  <AIMessage
                    message={message.content}
                    showActions={showMessageActions}
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
            ))}
            {isLoading && (
              <div className="flex items-center space-x-2 text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
                <span className="text-sm">AI is thinking...</span>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Area */}
      <div className="border-t border-gray-100 p-4">
        <ChatInput onSubmit={handleSendMessage} />
      </div>
    </div>
  );
}
