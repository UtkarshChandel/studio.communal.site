"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/ui/Sidebar";
import StudioHeader from "@/components/ui/StudioHeader";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import ChatWindow, { Message } from "@/components/ui/ChatWindow";
import { useSidebarNavigation } from "@/hooks/useSidebarNavigation";

export default function StudioPage() {
  const router = useRouter();

  // Sample chat messages
  const [chatMessages, setChatMessages] = React.useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content:
        "Hey there, Let's get started.\nWhat expertise would you like to model in your AI self today?",
      timestamp: new Date(),
    },
    {
      id: "2",
      type: "human",
      content: "Startup strategy and product-market fit validation.",
      timestamp: new Date(),
      userName: "Sneha",
    },
    {
      id: "3",
      type: "ai",
      content:
        "This is a fascinating area to dive into! How do you typically approach startup strategy and product-market fit validation? What are the key principles or steps you follow?",
      timestamp: new Date(),
    },
    {
      id: "4",
      type: "human",
      content:
        "First, identify the riskiest assumptions, then craft an MVP to test those with real target users, iterate based on their feedback, track retention and referrals closely—and only scale once early users genuinely love the product.",
      timestamp: new Date(),
      userName: "Sneha",
    },
    {
      id: "5",
      type: "ai",
      content:
        "That's an insightful process! What influences your decision when identifying the riskiest assumptions, and how do you prioritize them?",
      timestamp: new Date(),
    },
  ]);

  const handleSendMessage = async (message: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "human",
      content: message,
      timestamp: new Date(),
      userName: "Sneha",
    };

    setChatMessages((prev) => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content:
          "That's a great question! Let me help you with that. This is a simulated AI response to demonstrate the chat functionality.",
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

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
      <div className="flex-1 relative overflow-y-auto bg-gray-50">
        {/* Header */}
        <StudioHeader />

        {/* Content */}
        <div className="p-8">
          <div className="w-full">
            {/* Avatar with Action Buttons */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <Avatar
                  name="Ask Olivia Rhye"
                  role="Marketer"
                  showOnlineStatus={true}
                  badge={{ text: "Training", color: "orange" }}
                  onClick={() => console.log("Clicked Olivia Rhye")}
                />

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => router.push("/studio/settings")}
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
                  <Button
                    variant="secondary"
                    onClick={() => console.log("Try clicked")}
                  >
                    Try
                  </Button>
                  <Button
                    variant="gradient"
                    onClick={() => console.log("Publish clicked")}
                  >
                    Publish
                  </Button>
                </div>
              </div>
            </div>

            {/* Chat Window */}
            <div className="mb-8 flex-1">
              <div className="h-[calc(100vh-300px)] min-h-[600px]">
                <ChatWindow
                  messages={chatMessages}
                  onSendMessage={handleSendMessage}
                  placeholder="What expertise are we scaling today?"
                  userName="Sneha"
                  showMessageActions={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
