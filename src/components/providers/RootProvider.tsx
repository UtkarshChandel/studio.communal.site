"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import PageLoader from "@/components/ui/PageLoader";
import { listSessions } from "@/lib/sessions";
import { useSessionStore } from "@/store/useSessionStore";
import ToastContainer from "@/components/ui/Toast";

export function RootProvider({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);
  const pathname = usePathname();

  // Define routes that don't need authentication
  const isPublicRoute =
    pathname?.match(/^\/[^\/]+\/[^\/]+\/[^\/]+$/) || // [username]/[agentName]/[sessionId]
    pathname === "/login" ||
    pathname?.startsWith("/api") ||
    pathname?.startsWith("/_next");

  useEffect(() => {
    const checkInitialAuth = async () => {
      // Skip auth check for public routes
      if (isPublicRoute) {
        setIsHydrated(true);
        return;
      }
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
              useSessionStore.getState() as {
                setLoading: (loading: boolean) => void;
                setError: (error: string | null) => void;
                setSessions: (sessions: unknown[]) => void;
              };
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
                    isPublished: s.isPublished ?? false,
                  }))
                );
              })
              .catch((e: unknown) => {
                setError?.(
                  e instanceof Error ? e.message : "Failed to load sessions"
                );
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
  }, [isPublicRoute]);

  if (!isHydrated) return <PageLoader message="Loading" />;
  return (
    <>
      {children}
      <ToastContainer />
    </>
  );
}
