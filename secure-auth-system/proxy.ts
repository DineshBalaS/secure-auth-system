import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth/session";

// 1. Route Buckets: Define which paths are protected vs public
const protectedRoutes = ["/dashboard"];
const authRoutes = [
  "/login",
  "/register",
  "/verify",
  "/forgot-password",
  "/reset-password",
];

// 2. Export Default Function (The Entry Point)
export default async function proxy(req: NextRequest) {
  // A. Extract the session cookie
  const token = req.cookies.get("auth_token")?.value;

  // B. Verify Session (Edge-safe verification)
  // If verifyToken returns null, the session is treated as invalid
  const session = token ? await verifyToken(token) : null;
  const isAuth = !!session;

  const { pathname } = req.nextUrl;

  // C. SCENARIO 1: Protecting Private Routes
  // Logic: If user visits /dashboard* AND is NOT authenticated -> Redirect to /login
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !isAuth) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    // Optional: Append 'callbackUrl' to redirect back after login
    // loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // D. SCENARIO 2: Redirecting Authenticated Users (UX Optimization)
  // Logic: If user visits /login or /register AND IS authenticated -> Redirect to /dashboard
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isAuthRoute && isAuth) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl.origin));
  }

  // E. Default: Allow request to proceed
  return NextResponse.next();
}

// 3. Matcher Configuration
// Optimizes performance by preventing the proxy from running on static assets
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder assets (images, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
