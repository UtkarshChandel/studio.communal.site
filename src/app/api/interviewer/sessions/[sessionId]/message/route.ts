import { NextRequest } from "next/server";
import { getApiBaseUrl } from "@/lib/env";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, ctx: { params: any }) {
    const base = getApiBaseUrl().replace(/\/$/, "");
    const p = ctx?.params;
    const sessionId = (p && typeof p.then === "function") ? (await p).sessionId : p?.sessionId;
    const { searchParams } = new URL(req.url);
    const text = searchParams.get("text") ?? "";
    const cloneId = searchParams.get("cloneId") ?? "";

    const cookieHeader = req.headers.get("cookie") || "";
    const backendUrl = `${base}/api/v1/interviewer/sessions/${encodeURIComponent(
        sessionId
    )}/message?text=${encodeURIComponent(text)}&cloneId=${encodeURIComponent(cloneId)}`;

    try {
        const upstream = await fetch(backendUrl, {
            method: "GET",
            headers: {
                Cookie: cookieHeader,
                Accept: "text/event-stream",
                "Cache-Control": "no-cache",
                Connection: "keep-alive",
            },
            cache: "no-store",
        });

        const contentType = upstream.headers.get("content-type") || "text/event-stream";
        const headers = new Headers({
            "Content-Type": contentType,
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
            "X-Accel-Buffering": "no",
        });

        return new Response(upstream.body, { status: 200, headers });
    } catch (e) {
        return new Response("event: error\n" + `data: ${JSON.stringify({ error: "proxy_error" })}\n\n`, {
            status: 200,
            headers: { "Content-Type": "text/event-stream" },
        });
    }
}


