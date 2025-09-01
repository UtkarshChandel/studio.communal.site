import { NextRequest, NextResponse } from "next/server";
import { getApiBaseUrl } from "@/lib/env";

export const dynamic = "force-dynamic";

// GET /api/v1/sessions - List sessions
export async function GET(req: NextRequest) {
    try {
        const apiBaseUrl = getApiBaseUrl();
        const cookieHeader = req.headers.get("cookie") || "";

        console.log("🔍 /api/v1/sessions GET called");
        console.log("🍪 Cookies being forwarded:", cookieHeader);

        const backendUrl = `${apiBaseUrl}/api/v1/sessions`;
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
        console.error("❌ /api/v1/sessions GET error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch sessions", error: String(error) },
            { status: 500 }
        );
    }
}

// POST /api/v1/sessions - Create session
export async function POST(req: NextRequest) {
    try {
        const apiBaseUrl = getApiBaseUrl();
        const cookieHeader = req.headers.get("cookie") || "";
        const body = await req.json();

        console.log("🔍 /api/v1/sessions POST called");
        console.log("🍪 Cookies being forwarded:", cookieHeader);
        console.log("📦 Request body:", body);

        const backendUrl = `${apiBaseUrl}/api/v1/sessions`;
        console.log("📡 Calling backend:", backendUrl);

        const response = await fetch(backendUrl, {
            method: "POST",
            headers: {
                Cookie: cookieHeader,
                "Content-Type": "application/json",
                "X-Forwarded-For": req.headers.get("x-forwarded-for") || "",
                "User-Agent": req.headers.get("user-agent") || "",
            },
            body: JSON.stringify(body),
            credentials: "include",
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
        console.error("❌ /api/v1/sessions POST error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to create session", error: String(error) },
            { status: 500 }
        );
    }
}
