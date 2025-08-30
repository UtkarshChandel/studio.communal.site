export const API_BASE_URL: string =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3200";

export function getApiBaseUrl(): string {
    // Ensure no trailing slash for consistent URL joining
    return API_BASE_URL.replace(/\/$/, "");
}


