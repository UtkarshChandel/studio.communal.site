import { create } from "zustand";

export interface SessionItem {
    id: string;
    name?: string | null;
    description?: string | null;
    tags?: string[];
    cloneId?: string;
    createdAt?: string;
    isPublished?: boolean;
}

interface SessionState {
    sessions: SessionItem[];
    activeSessionId: string | null;
    loading: boolean;
    error: string | null;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    addSession: (session: SessionItem) => void;
    setSessions: (sessions: SessionItem[]) => void;
    setActiveSession: (id: string | null) => void;
    updateSession: (id: string, updates: Partial<SessionItem>) => void;
    clear: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
    sessions: [],
    activeSessionId: null,
    loading: false,
    error: null,
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    addSession: (session) =>
        set((state) => ({
            sessions: [session, ...state.sessions.filter((s) => s.id !== session.id)],
            activeSessionId: session.id,
        })),
    setSessions: (sessions) => set({ sessions }),
    setActiveSession: (id) => set({ activeSessionId: id }),
    updateSession: (id, updates) =>
        set((state) => ({
            sessions: state.sessions.map((s) =>
                s.id === id ? { ...s, ...updates } : s
            ),
        })),
    clear: () => set({ sessions: [], activeSessionId: null, loading: false, error: null }),
}));


