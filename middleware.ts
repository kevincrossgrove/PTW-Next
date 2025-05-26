import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  const cookies = getSessionCookie(request);
  const { pathname } = request.nextUrl;

  // Redirect user to dashboard if they are already logged in, and try to access login or signup pages
  if (["/login", "/signup"].includes(pathname)) {
    if (cookies) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } else {
      return NextResponse.next();
    }
  }

  if (!cookies) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/login", "/signup"],
};
