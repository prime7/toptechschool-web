import { NextResponse } from "next/server";

// This is a temporary debug endpoint to help diagnose environment variable issues
// IMPORTANT: Remove this endpoint after debugging is complete for security reasons
export async function GET() {
  // Only allow this endpoint in development or with a special debug key
  const debugKey = process.env.DEBUG_KEY;
  const isAuthorized = process.env.NODE_ENV === "development" || 
                       (debugKey && debugKey === "your-secret-debug-key");
  
  if (!isAuthorized) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  // Collect environment information without exposing sensitive values
  const envInfo = {
    NODE_ENV: process.env.NODE_ENV,
    RESEND_API_KEY_EXISTS: !!process.env.RESEND_API_KEY,
    RESEND_API_KEY_LENGTH: process.env.RESEND_API_KEY?.length || 0,
    RESEND_API_KEY_PREFIX: process.env.RESEND_API_KEY?.substring(0, 3) || "",
    DATABASE_URL_EXISTS: !!process.env.DATABASE_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET_EXISTS: !!process.env.NEXTAUTH_SECRET,
    VERCEL_ENV: process.env.VERCEL_ENV,
    VERCEL_URL: process.env.VERCEL_URL,
  };

  return NextResponse.json(
    { 
      message: "Environment debug information",
      environment: envInfo
    },
    { status: 200 }
  );
} 