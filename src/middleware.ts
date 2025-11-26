import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;

  const mode = (process.env.NEXT_PUBLIC_APP_MODE ?? process.env.APP_MODE ?? "prod").toLowerCase();
  const isDemo = mode === "demo";

  if (!isDemo) return NextResponse.next();

  if (url.pathname.startsWith("/auth")) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/auth/:path*"],
};
