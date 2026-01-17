import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


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

    // 3. Maintenance Mode Check
    // Removed from Middleware to avoid "Prisma Client in Edge Runtime" error.
    // The check is performed safely in `src/app/layout.tsx` (Server Component).

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
