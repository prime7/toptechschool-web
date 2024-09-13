import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const RESTRICTED_ROUTES = ["/me"];

export async function middleware(req: NextRequest) {
  const response = NextResponse.next();
  const { pathname } = req.nextUrl;
  const token = await getToken({ req });
  const isAuthenticated = !!token;

  if (RESTRICTED_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/api/auth/signin", req.url));
    }
  }

  return response;
}
