"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { SIDEBAR_ROUTES } from "@/config/sidebar";
import { NavigationItem } from "@/components/ui/NavigationList";

export function useSidebarNavigation(): NavigationItem[] {
  const pathname = usePathname();
  const router = useRouter();

  return SIDEBAR_ROUTES.map((route) => {
    const isActive =
      route.activeMatch === "startsWith"
        ? pathname.startsWith(route.href)
        : pathname === route.href;

    return {
      id: route.id,
      label: route.label,
      icon: <route.Icon />,
      isActive,
      onClick: () => router.push(route.href),
    };
  });
}
