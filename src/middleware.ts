import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { RESTRICTED_ROUTES, ALLOWED_ORIGINS } from "@/lib/constants";

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const origin = req.headers.get("origin") || "";

  const session = await auth();
  const response = NextResponse.next();
  response.headers.set("x-session", JSON.stringify(session || {}));

  const isAllowedOrigin = ALLOWED_ORIGINS.some(
    (allowedOrigin) =>
      allowedOrigin === origin ||
      (allowedOrigin.startsWith("chrome-extension://") &&
        origin.startsWith("chrome-extension://"))
  );

  if (isAllowedOrigin) {
    response.headers.set("Access-Control-Allow-Credentials", "true");
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET,DELETE,PATCH,POST,PUT"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
    );
  }

  if (req.method === "OPTIONS") {
    return response;
  }

  if (pathname === "/verify-email" && session?.user?.isEmailVerified) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (RESTRICTED_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!session) {
      return NextResponse.redirect(new URL("/api/auth/signin", req.url));
    }
    if (!session.user.isEmailVerified) {
      return NextResponse.redirect(new URL("/verify-email", req.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/upload",
    "/resume",
    "/job",
    "/((?!_next/static|_next/image|favicon.ico).*)",
    "/api/job/evaluate",
    "/api/resume/:resumeId",
    "/api/file-upload",
    "/verify-email",
  ],
};
