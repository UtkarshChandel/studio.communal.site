import { NextRequest, NextResponse } from "next/server";
import { getApiBaseUrl } from "@/lib/env";

export async function GET(req: NextRequest) {
    const base = getApiBaseUrl();
    const cookieHeader = req.headers.get("cookie") || "";
    console.log("🔍 /api/auth/me called");
    console.log("🍪 Cookies being forwarded:", cookieHeader);
    try {
        const backendUrl = `${base}/api/auth/me`;
        console.log("📡 Calling backend:", backendUrl);
        const res = await fetch(backendUrl, {
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

        console.log("📡 Backend response status:", res.status);
        const contentType = res.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
            const data = await res.json().catch(() => null);
            console.log("📦 Backend response data:", data);
            const response = NextResponse.json(data ?? {}, { status: res.status });
            const setCookieHeader = res.headers.get("set-cookie");
            if (setCookieHeader) {
                console.log("🍪 Forwarding Set-Cookie header:", setCookieHeader);
                response.headers.set("Set-Cookie", setCookieHeader);
            }
            return response;
        } else {
            const text = await res.text();
            console.log("📄 Non-JSON response:", text);
            return new NextResponse(text, {
                status: res.status,
                headers: { "Content-Type": "text/plain" },
            });
        }
    } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        console.error("❌ /api/auth/me error:", errorMessage);
        return NextResponse.json(
            { success: false, message: "Auth check failed", error: errorMessage },
            { status: 500 }
        );
    }
}


