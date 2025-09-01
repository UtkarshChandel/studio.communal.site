import { NextRequest, NextResponse } from "next/server";
import { getApiBaseUrl } from "@/lib/env";

export const dynamic = "force-dynamic";

// GET /api/v1/sessions/[sessionId]/history - Get session history
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ sessionId: string }> }
) {
    try {
        const { sessionId } = await params;
        const apiBaseUrl = getApiBaseUrl();
        const cookieHeader = req.headers.get("cookie") || "";

        // Forward query parameters
        const { searchParams } = new URL(req.url);
        const queryString = searchParams.toString();

        console.log("🔍 /api/v1/sessions/[sessionId]/history GET called");
        console.log("🆔 Session ID:", sessionId);
        console.log("🔍 Query params:", queryString);
        console.log("🍪 Cookies being forwarded:", cookieHeader);

        const backendUrl = `${apiBaseUrl}/api/v1/sessions/${encodeURIComponent(sessionId)}/history${queryString ? `?${queryString}` : ''}`;
        console.log("📡 Calling backend:", backendUrl);

        const response = await fetch(backendUrl, {
            method: "GET",
            headers: {
                Cookie: cookieHeader,
                "Content-Type": "application/json",
                "X-Forwarded-For": req.headers.get("x-forwarded-for") || "",
                "User-Agent": req.headers.get("user-agent") || "",
            },
            credentials: "include",
            cache: "no-store",
        });

        console.log("📡 Backend response status:", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("❌ Backend error:", errorText);
            return new NextResponse(errorText, {
                status: response.status,
                headers: { "Content-Type": "application/json" },
            });
        }

        const data = await response.json();
        console.log("📦 Backend response data:", data);

        const nextResponse = NextResponse.json(data, { status: response.status });

        // Forward any Set-Cookie headers
        const setCookieHeader = response.headers.get("set-cookie");
        if (setCookieHeader) {
            console.log("🍪 Forwarding Set-Cookie header:", setCookieHeader);
            nextResponse.headers.set("Set-Cookie", setCookieHeader);
        }

        return nextResponse;
    } catch (error) {
        console.error("❌ /api/v1/sessions/[sessionId]/history GET error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch session history", error: String(error) },
            { status: 500 }
        );
    }
}
