import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isMaintenanceMode } from "./lib/system";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Build response to modify headers
    const response = NextResponse.next();

    // 2. Security Headers (The "Helmet")
    // Protects against Clickjacking, Sniffing, and ensures SSL
    const securityHeaders = {
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "X-XSS-Protection": "1; mode=block",
        "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
        "Permissions-Policy": "camera=(), microphone=(), geolocation=(), browsing-topics=()",
        "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: res.cloudinary.com; font-src 'self' data:;"
    };

    Object.entries(securityHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
    });

    // 3. Maintenance Mode Check (Performant Edge Check)
    // Skip for assets, api, and admin to allow maintenance bypass
    if (
        !pathname.startsWith("/_next") &&
        !pathname.startsWith("/api") &&
        !pathname.startsWith("/static")
    ) {
        try {
            // We reuse the existing logic but check it here to block traffic earlier
            const maintenance = await isMaintenanceMode();
            // NOTE: If maintenance is ON, we might want to redirect.
            // For now, we will let RootLayout handle the UI rendering to verify this first.

            // Uncomment below to enforce HARD redirect at edge level later
            // if (maintenance && !pathname.includes('maintenance')) {
            //    return NextResponse.rewrite(new URL('/maintenance', request.url));
            // }
        } catch (error) {
            console.error("Middleware Maintenance Check Failed", error);
        }
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
