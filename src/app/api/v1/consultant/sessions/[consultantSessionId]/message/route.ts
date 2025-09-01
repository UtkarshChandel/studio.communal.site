import { NextRequest } from "next/server";
import { getApiBaseUrl } from "@/lib/env";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ consultantSessionId: string }> }
) {
    try {
        const { consultantSessionId } = await params;
        const { searchParams } = new URL(request.url);
        const text = searchParams.get("text");

        if (!text) {
            return new Response(
                JSON.stringify({ type: "error", data: { message: "Missing text parameter" } }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "text/event-stream",
                        "Cache-Control": "no-cache",
                        "Connection": "keep-alive",
                    },
                }
            );
        }

        const apiBaseUrl = getApiBaseUrl();
        const backendUrl = `${apiBaseUrl}/api/v1/consultant/sessions/${encodeURIComponent(consultantSessionId)}/message?text=${encodeURIComponent(text)}`;

        const response = await fetch(backendUrl, {
            method: "GET",
            headers: {
                "Accept": "text/event-stream",
            },
        });

        if (!response.ok) {
            return new Response(
                JSON.stringify({ type: "error", data: { message: "Failed to connect to backend" } }),
                {
                    status: response.status,
                    headers: {
                        "Content-Type": "text/event-stream",
                        "Cache-Control": "no-cache",
                        "Connection": "keep-alive",
                    },
                }
            );
        }

        // Set up SSE headers
        const headers = new Headers({
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        });

        // Create a readable stream to forward the SSE data
        const stream = new ReadableStream({
            start(controller) {
                if (!response.body) {
                    controller.close();
                    return;
                }

                const reader = response.body.getReader();
                const decoder = new TextDecoder();

                function pump(): Promise<void> {
                    return reader.read().then(({ done, value }) => {
                        if (done) {
                            controller.close();
                            return;
                        }

                        const chunk = decoder.decode(value, { stream: true });
                        controller.enqueue(new TextEncoder().encode(chunk));
                        return pump();
                    });
                }

                return pump();
            },
        });

        return new Response(stream, { headers });
    } catch (error) {
        console.error("Error streaming consultant message:", error);
        return new Response(
            JSON.stringify({ type: "error", data: { message: "Internal server error" } }),
            {
                status: 500,
                headers: {
                    "Content-Type": "text/event-stream",
                    "Cache-Control": "no-cache",
                    "Connection": "keep-alive",
                },
            }
        );
    }
}
