import { httpClient } from "@/lib/http";

export interface CreateSessionResponse {
    success: boolean;
    message?: string;
    data?: {
        id: string;
        cloneId: string;
        userId: string;
        type: string;
        name?: string | null;
        description?: string | null;
        createdAt: string;
        updatedAt: string;
    };
}

export async function createSession(cloneId: string) {
    const res = await httpClient.post<CreateSessionResponse>("/api/v1/sessions", {
        cloneId,
    }, { credentials: "include" as RequestCredentials });

    if (res.error || !res.data?.success || !res.data?.data) {
        throw new Error(res.error || res.data?.message || "Failed to create session");
    }
    return res.data.data;
}

export interface ListSessionsResponse {
    success: boolean;
    message?: string;
    data?: Array<{
        id: string;
        cloneId: string;
        name?: string | null;
        description?: string | null;
        tags?: string[];
        createdAt: string;
    }>;
}

export async function listSessions() {
    const res = await httpClient.get<ListSessionsResponse>("/api/v1/sessions", { credentials: "include" as RequestCredentials });
    if (res.error || !res.data?.success || !res.data?.data) {
        throw new Error(res.error || res.data?.message || "Failed to load sessions");
    }
    return res.data.data;
}

// ---- Session history ----
export type BackendHistoryItem = {
    id: string;
    role?: string; // 'assistant' | 'user'
    type?: string; // alternative
    text?: string;
    content?: string;
    createdAt?: string;
};

export type HistoryWindow = {
    items: BackendHistoryItem[];
    page: {
        firstId: string;
        lastId: string;
        hasBefore: boolean;
        hasAfter: boolean;
    };
};

export interface HistoryResponseNew {
    success?: boolean;
    data?: HistoryWindow;
    message?: string;
}

// ---- Update session ----
export type UpdateSessionPayload = {
    name?: string | null;
    description?: string | null;
    tags?: string[];
};

export async function updateSession(
    sessionId: string,
    payload: UpdateSessionPayload
) {
    const res = await httpClient.patch<any>(
        `/api/v1/sessions/${encodeURIComponent(sessionId)}`,
        payload,
        { credentials: "include" as RequestCredentials }
    );
    if (res.error || !res.data) {
        throw new Error(res.error || "Failed to update session");
    }
    return res.data;
}

// ---- Publishing status ----
export type PublishingStatusResponse = {
    success: boolean;
    message?: string;
    data?: {
        isReadyToPublish: boolean;
        nodes: number;
        relationships: number;
    };
};

export async function fetchPublishingStatus(sessionId: string) {
    const res = await httpClient.get<PublishingStatusResponse>(
        `/api/v1/sessions/publishing-status/${encodeURIComponent(sessionId)}`,
        { credentials: "include" as RequestCredentials }
    );
    if (res.error || !res.data?.success || !res.data?.data) {
        throw new Error(res.error || res.data?.message || "Failed to fetch publishing status");
    }
    return res.data.data;
}

export async function fetchSessionHistory(
    sessionId: string,
    params: {
        limit: number;
        includeAssistant?: boolean;
        anchorMessageId?: string;
        anchorTurnId?: string;
        direction?: "before" | "after";
    }
) {
    const query = new URLSearchParams();
    query.set("limit", String(params.limit));
    if (params.includeAssistant !== undefined)
        query.set("includeAssistant", String(params.includeAssistant));
    if (params.anchorMessageId) query.set("anchorMessageId", params.anchorMessageId);
    if (params.anchorTurnId) query.set("anchorTurnId", params.anchorTurnId);
    if (params.direction) query.set("direction", params.direction);

    const res = await httpClient.get<HistoryResponseNew>(
        `/api/v1/sessions/${encodeURIComponent(sessionId)}/history?${query.toString()}`,
        { credentials: "include" as RequestCredentials, cache: "no-store" }
    );
    const payload = res.data?.data;
    if (res.error || !payload) {
        throw new Error(res.error || res.data?.message || "Failed to fetch history");
    }
    return payload;
}



