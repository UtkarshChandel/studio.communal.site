import { getApiBaseUrl } from "./env";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface ApiResponse<T> {
    data: T | null;
    error: string | null;
    status: number;
}

export class HttpClient {
    private readonly useProxy: boolean;

    constructor(useProxy: boolean = true) {
        this.useProxy = useProxy;
    }

    private buildUrl(path: string): string {
        const normalizedPath = path.startsWith("/") ? path : `/${path}`;

        if (this.useProxy) {
            // Use Next.js API proxy routes (frontend domain)
            // This ensures proper cookie forwarding and CORS handling
            return normalizedPath;
        } else {
            // Direct backend calls (only for specific cases)
            return `${getApiBaseUrl()}${normalizedPath}`;
        }
    }

    async request<T>(
        path: string,
        options: RequestInit & { method?: HttpMethod } = {}
    ): Promise<ApiResponse<T>> {
        try {
            const res = await fetch(this.buildUrl(path), {
                credentials: "include",
                ...options,
                headers: {
                    "Content-Type": "application/json",
                    ...(options.headers || {}),
                },
            });

            const contentType = res.headers.get("content-type") || "";
            const isJson = contentType.includes("application/json");
            const body = isJson ? await res.json().catch(() => null) : await res.text();

            if (!res.ok) {
                const message =
                    (isJson && body && (body.message || body.error)) ||
                    (typeof body === "string" && body) ||
                    `Request failed with status ${res.status}`;
                return { data: null, error: message, status: res.status };
            }

            return { data: (body as T) ?? null, error: null, status: res.status };
        } catch (err) {
            const message = err instanceof Error ? err.message : "Network error";
            return { data: null, error: message, status: 0 };
        }
    }

    get<T>(path: string, init?: RequestInit) {
        return this.request<T>(path, { ...init, method: "GET" });
    }

    post<T>(path: string, body?: unknown, init?: RequestInit) {
        return this.request<T>(path, {
            ...init,
            method: "POST",
            body: body !== undefined ? JSON.stringify(body) : undefined,
        });
    }

    patch<T>(path: string, body?: unknown, init?: RequestInit) {
        return this.request<T>(path, {
            ...init,
            method: "PATCH",
            body: body !== undefined ? JSON.stringify(body) : undefined,
        });
    }
}

export const httpClient = new HttpClient();


