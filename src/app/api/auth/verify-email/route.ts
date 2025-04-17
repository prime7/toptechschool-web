import { auth, updateSession } from "@/lib/auth";
import { NextResponse } from "next/server";
import { sendEmailVerificationEmail } from "@/lib/resend";
import { prisma } from "@/lib/prisma";
import { withRateLimit, RateLimitKey, RateLimitError } from "@/lib/redis/rate-limit";
import { createVerificationToken, verifyToken } from "@/lib/jwt";

export async function POST() {
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
                const token = await createVerificationToken(email);
                const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${token}`;
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

    const email = await verifyToken(token);
    if (!email || email !== session.user.email) {
        return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }
    await updateSession({
        ...session,
        user: {
            ...session.user,
            isEmailVerified: true,
            emailVerified: new Date()
        }
    })

    const updatedUser = await prisma.user.update({
        where: { id: session.user.id },
        data: { isEmailVerified: true }
    });

    return NextResponse.json({
        success: true,
        message: "Email verified successfully",
        user: {
            id: updatedUser.id,
            email: updatedUser.email,
            isEmailVerified: updatedUser.isEmailVerified
        },
    });
}
