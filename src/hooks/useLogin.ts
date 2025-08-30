"use client";

import { useCallback, useMemo, useState } from "react";
import { getApiBaseUrl } from "@/lib/env";

interface UseLoginState {
    betaCode: string;
    setBetaCode: (v: string) => void;
    loading: boolean;
    error: string | null;
    signInWithGoogle: () => Promise<void>;
}

export function useLogin(): UseLoginState {
    const [betaCode, setBetaCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const baseUrl = useMemo(() => getApiBaseUrl(), []);

    const signInWithGoogle = useCallback(async () => {
        setError(null);

        try {
            setLoading(true);
            const url = new URL("/api/auth/google", baseUrl);
            const cleaned = betaCode.trim();
            if (cleaned.length > 0) {
                url.searchParams.set("betaCode", cleaned);
            }

            // For OAuth, redirect to backend. Cookies will be set via backend.
            window.location.href = url.toString();
        } catch (e) {
            setError("Failed to initiate Google sign-in.");
        } finally {
            setLoading(false);
        }
    }, [baseUrl, betaCode]);

    // Optional helper to verify right after returning from OAuth
    const verifyAfterLogin = useCallback(async (): Promise<boolean> => {
        try {
            const res = await fetch("/api/auth/me", {
                method: "GET",
                credentials: "include",
                cache: "no-store",
            });
            if (res.ok) {
                const data = await res.json();
                if (data?.success && data?.data) {
                    return true;
                }
            }
            return false;
        } catch {
            return false;
        }
    }, []);

    return { betaCode, setBetaCode, loading, error, signInWithGoogle };
}


