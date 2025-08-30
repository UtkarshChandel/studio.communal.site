"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import PageLoader from "@/components/ui/PageLoader";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const setUser = useUserStore((state) => state.setUser);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });
        const data = await res.json().catch(() => null);
        if (res.ok && data?.success && (data.data || data.user)) {
          const u = data.data ?? data.user;
          setUser({
            id: u.id,
            email: u.email,
            name: u.name ?? "",
            picture: u.picture,
          });
          setIsAuthenticated(true);
        } else {
          setUser(null);
          router.push("/login");
        }
      } catch (_err) {
        setUser(null);
        router.push("/login");
      } finally {
        setIsChecking(false);
      }
    };
    checkAuth();
  }, [router, setUser]);

  if (isChecking) return fallback ?? <PageLoader message="Loading" />;
  if (!isAuthenticated) return null;
  return <>{children}</>;
}
