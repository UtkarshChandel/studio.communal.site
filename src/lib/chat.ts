import { getApiBaseUrl } from "@/lib/env";

export type StreamHandler = {
    onDelta?: (text: string) => void;
    // May be invoked multiple times in JSON framing:
    // - on 'end' (no text) to stop typing ASAP
    // - on 'final' (with text) to replace the bubble with the aggregated content
    onDone?: (finalText?: string) => void;
    onError?: (err: Error) => void;
};

// Server-Sent Events stream helper
export function streamInterviewerMessage(
    sessionId: string,
    text: string,
    cloneId: string,
    handlers: StreamHandler = {}
) {
    const base = getApiBaseUrl().replace(/\/$/, "");
    // Use Next proxy route to avoid CORS/SSE buffering issues
    const url = `${typeof window !== 'undefined' ? '' : base}/api/interviewer/sessions/${encodeURIComponent(
        sessionId
    )}/message?text=${encodeURIComponent(text)}&cloneId=${encodeURIComponent(cloneId)}`;

    const controller = new AbortController();
    const es = new EventSource(url, { withCredentials: true } as any);

    let finished = false;

    type Frame =
        | { type: "start"; data?: any }
        | { type: "delta"; data: string }
        | { type: "final"; data: string }
        | { type: "end"; data?: any }
        | { type: "error"; data?: { message?: string } };

    es.onmessage = (e: MessageEvent) => {
        if (finished) return;
        try {
            const raw = typeof e.data === "string" ? e.data : String(e.data);
            const frame = JSON.parse(raw) as Frame;
            switch (frame?.type) {
                case "start":
                    // no-op for now
                    break;
                case "delta": {
                    const text = frame.data || "";
                    handlers.onDelta?.(text);
                    break;
                }
                case "final": {
                    const text = frame.data || "";
                    handlers.onDone?.(text);
                    try { es.close(); } catch { }
                    finished = true;
                    break;
                }
                case "end": {
                    handlers.onDone?.();
                    // keep the connection open in case 'final' follows
                    break;
                }
                case "error": {
                    const msg = (frame as any)?.data?.message || "stream_error";
                    handlers.onError?.(new Error(msg));
                    try { es.close(); } catch { }
                    finished = true;
                    break;
                }
                default:
                    break;
            }
        } catch (err: any) {
            handlers.onError?.(err);
        }
    };

    es.onerror = () => {
        if (!finished) {
            handlers.onDone?.();
            try { es.close(); } catch { }
            finished = true;
        }
    };

    return {
        stop: () => {
            try {
                es.close();
            } catch { }
            controller.abort();
        },
    };
}


