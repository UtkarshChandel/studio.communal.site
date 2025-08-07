"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/ui/Sidebar";
import StudioHeader from "@/components/ui/StudioHeader";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import ChatWindow, { Message } from "@/components/ui/ChatWindow";
import {
  HomeIcon,
  DocumentDuplicateIcon,
  ClipboardDocumentIcon,
  ShoppingBagIcon,
  CogIcon,
  CommandLineIcon,
} from "@heroicons/react/24/outline";

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

  const navigationItems = [
    {
      id: "home",
      label: "Home",
      icon: <HomeIcon />,
      isActive: false,
      onClick: () => router.push("/"),
    },
    {
      id: "clones",
      label: "My Clones",
      icon: <DocumentDuplicateIcon />,
      isActive: false,
      onClick: () => console.log("My Clones clicked"),
    },
    {
      id: "templates",
      label: "Templates",
      icon: <ClipboardDocumentIcon />,
      isActive: false,
      onClick: () => console.log("Templates clicked"),
    },
    {
      id: "studio",
      label: "Studio",
      icon: <CommandLineIcon />,
      isActive: true,
      onClick: () => console.log("Studio clicked"),
    },
    {
      id: "marketplace",
      label: "Marketplace",
      icon: <ShoppingBagIcon />,
      isActive: false,
      onClick: () => console.log("Marketplace clicked"),
    },
    {
      id: "settings",
      label: "Settings",
      icon: <CogIcon />,
      isActive: false,
      onClick: () => console.log("Settings clicked"),
    },
  ];

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
          <div className="max-w-4xl">
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
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                AI Training Session
              </h3>
              <div className="h-[600px]">
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
