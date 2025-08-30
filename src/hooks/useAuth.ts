"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { httpClient } from "@/lib/http";
import { useUserStore } from "@/store/useUserStore";

export interface AuthUser {
    id: string;
    email: string;
    name?: string;
    picture?: string; // backend returns `picture`
    avatarUrl?: string; // fallback key if used elsewhere
    role?: string;
    provider?: string;
}

interface UseAuthResult {
    user: AuthUser | null;
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
}

export function useAuth(redirectOn401: boolean = true): UseAuthResult {
    const router = useRouter();
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const setUserInStore = useUserStore((s) => s.setUser);

    const fetchMe = async () => {
        setError(null);
        setLoading(true);
        type BackendUser = {
            id: string;
            email: string;
            name?: string;
            picture?: string;
            provider?: string;
            role?: string;
            avatarUrl?: string;
        };
        const res = await httpClient.get<{ success: boolean; data?: BackendUser; message?: string }>("/api/auth/me", {
            cache: "no-store",
        });
        if (res.status === 401) {
            if (redirectOn401) router.replace("/login");
            setUser(null);
            setLoading(false);
            return;
        }
        if (res.error) {
            setError(res.error);
            setUser(null);
        } else {
            const payload = res.data as { success: boolean; data?: BackendUser } | null;
            const d = payload?.data;
            const mapped: AuthUser | null = d
                ? {
                    id: d.id,
                    email: d.email,
                    name: d.name,
                    picture: d.picture ?? d.avatarUrl,
                    avatarUrl: d.avatarUrl,
                    role: d.role,
                    provider: d.provider,
                }
                : null;
            setUser(mapped);
            if (mapped) {
                setUserInStore({
                    id: mapped.id,
                    email: mapped.email,
                    name: mapped.name ?? "",
                    picture: mapped.picture ?? mapped.avatarUrl,
                    provider: mapped.provider,
                    role: mapped.role,
                });
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchMe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { user, loading, error, refresh: fetchMe };
}


