import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { generateVerificationUrl } from "@/lib/verification";
import { sendEmailVerificationEmail } from "@/lib/resend";
import { prisma } from "@/lib/prisma";
import { withRateLimit, RateLimitKey, RateLimitError } from "@/lib/redis/rate-limit";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { email } = session.user;

  if (!email) {
    return NextResponse.json({ error: "Email not found" }, { status: 400 });
  }

  try {
    await withRateLimit(
      RateLimitKey.EmailVerification,
      email,
      async () => {
        const verificationUrl = await generateVerificationUrl(email);
        await sendEmailVerificationEmail(email, verificationUrl);
      }
    );
    return NextResponse.json({ message: "Verification email sent" }, { status: 200 });
  } catch (error) {
    if (error instanceof RateLimitError) {
      return NextResponse.json({ error: error.message }, { status: 429 });
    }
    return NextResponse.json({ error: "Failed to send verification email" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "Token not found" }, { status: 400 });
  }
  const { email } = session.user;
  if (!email) {
    return NextResponse.json({ error: "Email not found" }, { status: 400 });
  }

  const verificationToken = await prisma.verificationToken.findFirst({
    where: {
      token: token,
      expires: {
        gt: new Date()
      }
    }
  });

  if (!verificationToken) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
  }

  await prisma.verificationToken.delete({
    where: {
      token: token
    }
  });

  const updatedUser = await prisma.user.update({
    where: { id: session.user.id },
    data: { isEmailVerified: true }
  });

  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const host = req.headers.get('host') || 'localhost:3000';
  const callbackUrl = `${protocol}://${host}/resume`;

  return NextResponse.json({
    success: true,
    message: "Email verified successfully",
    user: {
      id: updatedUser.id,
      email: updatedUser.email,
      isEmailVerified: updatedUser.isEmailVerified
    },
    redirectTo: `/api/auth/session?callbackUrl=${encodeURIComponent(callbackUrl)}`
  });

}
