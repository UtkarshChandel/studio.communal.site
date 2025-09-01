import { httpClient } from "@/lib/http";

export interface ConsultantSession {
    id: string;
    cloneId: string;
    userId: string;
    type: "CONSULTANT";
    sourceSessionId: string;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateConsultantSessionResponse {
    success: boolean;
    message: string;
    data: ConsultantSession;
}

export async function createConsultantSession(sessionId: string): Promise<ConsultantSession> {
    const res = await httpClient.post<CreateConsultantSessionResponse>(
        `/api/v1/consultant/sessions/from/${encodeURIComponent(sessionId)}`,
        {},
        { credentials: "omit" as RequestCredentials } // No auth required
    );

    if (!res.data?.success || !res.data?.data) {
        throw new Error(res.data?.message || "Failed to create consultant session");
    }

    return res.data.data;
}

export interface ConsultantSSEEvent {
    type: "start" | "delta" | "tool_start" | "tool_end" | "final" | "end" | "error";
    data: any;
}

export function streamConsultantMessage(
    consultantSessionId: string,
    message: string,
    onEvent: (event: ConsultantSSEEvent) => void,
    onError?: (error: Error) => void,
    onComplete?: () => void
): () => void {
    const encodedMessage = encodeURIComponent(message);
    const url = `/api/v1/consultant/sessions/${encodeURIComponent(consultantSessionId)}/message?text=${encodedMessage}`;

    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
        try {
            const parsedEvent: ConsultantSSEEvent = JSON.parse(event.data);
            onEvent(parsedEvent);

            if (parsedEvent.type === "end") {
                eventSource.close();
                onComplete?.();
            } else if (parsedEvent.type === "error") {
                eventSource.close();
                onError?.(new Error(parsedEvent.data?.message || "Unknown error"));
            }
        } catch (err) {
            console.error("Error parsing SSE event:", err);
            onError?.(new Error("Failed to parse server response"));
        }
    };

    eventSource.onerror = (error) => {
        console.error("SSE connection error:", error);
        eventSource.close();
        onError?.(new Error("Connection error"));
    };

    // Return cleanup function
    return () => {
        eventSource.close();
    };
}
