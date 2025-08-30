"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import PageLoader from "@/components/ui/PageLoader";
import { listSessions } from "@/lib/sessions";
import { useSessionStore } from "@/store/useSessionStore";

export function RootProvider({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const checkInitialAuth = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json().catch(() => null);
          if (!data?.success || !data?.data) {
            useUserStore.getState().logout();
          } else {
            useUserStore.getState().setUser(data.data);
            // kick off async session load (non-blocking)
            const { setLoading, setError, setSessions } =
              useSessionStore.getState() as any;
            // Fire-and-forget: do NOT await here so the rest of the UI can render
            setLoading(true);
            listSessions()
              .then((sessions) => {
                setSessions(
                  sessions.map((s) => ({
                    id: s.id,
                    name: s.name ?? null,
                    description: s.description ?? null,
                    tags: s.tags ?? [],
                    cloneId: s.cloneId,
                    createdAt: s.createdAt,
                  }))
                );
              })
              .catch((e: any) => {
                setError?.(e?.message || "Failed to load sessions");
              })
              .finally(() => {
                setLoading?.(false);
              });
          }
        } else {
          useUserStore.getState().logout();
        }
      } catch (_err) {
        useUserStore.getState().logout();
      } finally {
        setIsHydrated(true);
      }
    };
    checkInitialAuth();
  }, []);

  if (!isHydrated) return <PageLoader message="Loading" />;
  return <>{children}</>;
}
