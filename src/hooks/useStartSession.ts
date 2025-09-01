"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { useSessionStore } from "@/store/useSessionStore";
import { createSession } from "@/lib/sessions";

export function useStartSession() {
    const router = useRouter();
    const user = useUserStore((s) => s.user);
    const addSession = useSessionStore((s) => s.addSession);
    const setActive = useSessionStore((s) => s.setActiveSession);
    const setLoading = useSessionStore((s) => s.setLoading);
    const setError = useSessionStore((s) => s.setError);
    const [submitting, setSubmitting] = useState(false);

    const start = useCallback(
        async (initialMessage?: string) => {
            if (!user) {
                setError("Not authenticated");
                return;
            }
            try {
                setSubmitting(true);
                setLoading(true);
                setError(null);
                const newSession = await createSession(user.name);
                addSession({ id: newSession.id, name: newSession.name, cloneId: newSession.cloneId, createdAt: newSession.createdAt });
                setActive(newSession.id);
                // Navigate to dynamic session route
                try {
                    // Prefer a temp stashed message if it exists (wrote before navigation)
                    const tempKey = "pendingMessage:__next__";
                    const preStashed = sessionStorage.getItem(tempKey);
                    if (preStashed) sessionStorage.removeItem(tempKey);
                    const toSave = (preStashed && preStashed.trim().length > 0)
                        ? preStashed
                        : (initialMessage || "");
                    if (toSave && toSave.trim().length > 0) {
                        sessionStorage.setItem(`pendingMessage:${newSession.id}`, toSave);
                    }
                } catch { }
                router.push(`/studio/${newSession.id}`);
                // Optionally pass the initial message via query or local state if needed
            } catch (e: unknown) {
                setError(e instanceof Error ? e.message : "Failed to start session");
            } finally {
                setSubmitting(false);
                setLoading(false);
            }
        },
        [user, addSession, setActive, router, setLoading, setError]
    );

    return { start, submitting };
}


