import crypto from "crypto";
import { prisma } from "./prisma";

export function generateVerificationToken(email: string): string {
    return crypto.randomBytes(32).toString("hex");
}

export async function generateVerificationUrl(email: string): Promise<string> {
    const token = generateVerificationToken(email);

    await prisma.verificationToken.create({
        data: {
            token,
            identifier: email,
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
        }
    });
    return `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${token}`;
}



