"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";

export function useAuthCheck() {
    const [isChecking, setIsChecking] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const user = useUserStore((state) => state.user);
    const setUser = useUserStore((state) => state.setUser);

    useEffect(() => {
        const verifyAuth = async () => {
            if (user) {
                console.log("✅ User already in store:", user);
                setIsAuthenticated(true);
                setIsChecking(false);
                return;
            }

            console.log("🔍 Checking auth for path:", pathname);

            try {
                const res = await fetch("/api/auth/me", {
                    method: "GET",
                    credentials: "include",
                    cache: "no-store",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                console.log("📡 Auth response status:", res.status);
                console.log("📡 Response headers:", Array.from(res.headers.entries()));

                if (res.ok) {
                    const data = await res.json();
                    console.log("📦 Auth response data:", data);
                    if (data?.success && data?.data) {
                        console.log("✅ Auth successful, setting user:", data.data);
                        setUser(data.data);
                        setIsAuthenticated(true);
                    } else {
                        console.log("❌ Auth failed: success=false or no user");
                        console.log("Response was:", data);
                        router.replace("/login?from=" + encodeURIComponent(pathname || "/"));
                        setIsAuthenticated(false);
                    }
                } else {
                    console.log("❌ Auth failed with status:", res.status);
                    const errorText = await res.text();
                    console.log("Error response:", errorText);
                    router.replace("/login?from=" + encodeURIComponent(pathname || "/"));
                    setIsAuthenticated(false);
                }
            } catch (_e) {
                console.error("❌ Auth check exception:", _e);
                router.replace("/login?from=" + encodeURIComponent(pathname || "/"));
                setIsAuthenticated(false);
            } finally {
                setIsChecking(false);
            }
        };

        verifyAuth();
    }, [user, router, pathname, setUser]);

    return { isChecking, isAuthenticated, user };
}


