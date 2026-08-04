import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.AUTH_SECRET!);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");
  const isWriteRoute = pathname.startsWith("/write");
  const isProfileRoute = pathname.startsWith("/profile");

  if (!isAdminRoute && !isWriteRoute && !isProfileRoute) return NextResponse.next();

  const token = request.cookies.get("session")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    if (isAdminRoute && payload.role !== "admin") {
      return NextResponse.redirect(new URL("/write", request.url));
    }
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/write", "/write/:path*", "/admin", "/admin/:path*", "/profile", "/profile/:path*"],
};
