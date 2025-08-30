"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import PageLoader from "@/components/ui/PageLoader";
import { httpClient } from "@/lib/http";
import { useUserStore } from "@/store/useUserStore";

export default function AuthBootstrap() {
  const router = useRouter();
  const pathname = usePathname();
  const setUser = useUserStore((s) => s.setUser);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const res = await httpClient.get<{
          success: boolean;
          data?: { id: string; email: string; name?: string; picture?: string };
        }>("/api/auth/me", { cache: "no-store" });
        if (!res.data || !res.data.success || !res.data.data) {
          if (pathname === "/" || pathname?.startsWith("/studio")) {
            router.replace("/login");
          }
          return;
        }
        const d = res.data.data;
        if (!cancelled) {
          setUser({
            id: d.id,
            email: d.email,
            name: d.name ?? "",
            picture: d.picture,
          });
        }
      } catch (_e) {
        if (pathname === "/" || pathname?.startsWith("/studio")) {
          router.replace("/login");
        }
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [router, pathname, setUser]);

  // Render nothing; this just initializes auth outside individual pages.
  return null;
}
