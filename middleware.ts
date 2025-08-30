//middleware.ts
import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3200";

// Define protected and public routes
const PROTECTED_ROUTES = ["/", "/studio", "/clones", "/settings"];
const PUBLIC_PREFIXES = ["/login", "/api", "/_next", "/favicon.ico"];

export async function middleware(req: NextRequest) {
    const pathname = req.nextUrl.pathname || "/";

    // Skip all public/static paths
    if (PUBLIC_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
        return NextResponse.next();
    }

    // Determine if this path is protected
    const isProtected = PROTECTED_ROUTES.some(
        (route) => pathname === route || pathname.startsWith(route + "/")
    );
    if (!isProtected) {
        return NextResponse.next();
    }

    try {
        const cookie = req.headers.get("cookie") || "";
        const res = await fetch(`${API_BASE}/api/auth/me`, {
            method: "GET",
            headers: { cookie },
            cache: "no-store",
        });

        if (res.ok) {
            const contentType = res.headers.get("content-type") || "";
            if (contentType.includes("application/json")) {
                const body = await res.json().catch(() => null as any);
                if (body?.success && body?.data) {
                    return NextResponse.next();
                }
            }
        }
    } catch (error) {
        console.error("Middleware auth check failed:", error);
    }

    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};


