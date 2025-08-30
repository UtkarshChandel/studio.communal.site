"use client";

import React from "react";
import Sidebar from "@/components/ui/Sidebar";
import AuthBootstrap from "@/components/auth/AuthBootstrap";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <AuthBootstrap />
      <Sidebar />
      <main className="flex-1 relative overflow-y-auto bg-gray-50">
        {children}
      </main>
    </div>
  );
}
