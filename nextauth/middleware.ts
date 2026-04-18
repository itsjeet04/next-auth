import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isPublicPath =
    path === "/login" ||
    path === "/signup" ||
    path === "/verifyemail";

  const token = request.cookies.get("token")?.value || "";

  // If logged in → block auth pages
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  // If not logged in → block protected pages
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next(); // ✅ IMPORTANT
}

export const config = {
  matcher: ["/", "/profile", "/login", "/signup", "/profile/:path*", "/verifyemail"],
};