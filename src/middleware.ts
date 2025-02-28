import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const RESTRICTED_ROUTES = [
  "/upload",
  "/resume",
];

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (RESTRICTED_ROUTES.some((route) => pathname.startsWith(route))) {
    const session = await auth();
    if (!session) {
      return NextResponse.redirect(new URL("/api/auth/signin", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/upload",
    "/resume",
  ],
};
