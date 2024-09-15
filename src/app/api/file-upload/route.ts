import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import s3Client from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  const { filename, fileType } = await request.json();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" });
  }

  try {
    const resume = await prisma.resume.create({
      data: {
        userId: session.user.id,
        filename,
        url: "",
      },
    });

    const key = `resumes/${session.user.id}/${resume.id}/${randomUUID().slice(
      0,
      6
    )}.pdf`;
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      ContentType: fileType,
    });
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });
    const encodedKey = encodeURIComponent(key);
    await prisma.resume.update({
      where: { id: resume.id },
      data: {
        url: `${process.env.CLOUDFLARE_R2_ENDPOINT}/${encodedKey}`,
      },
    });
    return NextResponse.json({ signedUrl, resumeId: resume.id });
  } catch (error) {
    return NextResponse.json({ error: "Error generating signed URL" });
  }
};

export const runtime = "edge";
