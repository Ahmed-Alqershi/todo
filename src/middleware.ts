import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { verifyToken } from "@/lib/server/auth";

function unauthorized(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.redirect(new URL("/login", request.url));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const headers = new Headers(request.headers);
  headers.set("x-current-path", pathname);

  if (pathname.startsWith("/login") || pathname.startsWith("/api/auth")) {
    return NextResponse.next({ headers });
  }

  const token = request.cookies.get("auth")?.value;
  if (!token) {
    return unauthorized(request);
  }
  try {
    const user = await verifyToken(token);
    if (pathname.startsWith("/admin") || pathname.startsWith("/api/users")) {
      if (user.role !== "admin") {
        return unauthorized(request);
      }
    }
    if (
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/projects") ||
      pathname.startsWith("/api/projects") ||
      pathname.startsWith("/api/tasks")
    ) {
      if (user.role !== "user") {
        return unauthorized(request);
      }
    }
    return NextResponse.next({ headers });
  } catch {
    return unauthorized(request);
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
