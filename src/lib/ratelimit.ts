import type { NextRequest } from "next/server";

const tracker = new Map<string, number[]>();

export function rateLimit(request: NextRequest, limit: number = 10, windowMs: number = 60 * 1000): boolean {
    const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const now = Date.now();

    // Get timestamps for this IP
    const windowStart = now - windowMs;
    const timestamps = tracker.get(ip) || [];

    // Filter out old timestamps
    const activeTimestamps = timestamps.filter(timestamp => timestamp > windowStart);

    if (activeTimestamps.length >= limit) {
        return true; // Rate limit exceeded
    }

    // Add current request
    activeTimestamps.push(now);
    tracker.set(ip, activeTimestamps);

    // Cleanup memory periodically (could be optimized)
    if (tracker.size > 10000) {
        tracker.clear(); // Emergency cleanup
    }

    return false; // Allowed
}
