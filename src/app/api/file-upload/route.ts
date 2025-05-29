import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSignedUrlForUpload } from "@/lib/r2";
import { inngest } from "@/lib/ingest/client";
import { withRateLimit, RateLimitKey, RateLimitError } from "@/lib/redis/rate-limit";

export async function POST(request: Request) {
  try {
    const { filename, fileType, jobRole } = await request.json();
    const session = JSON.parse(request.headers.get("x-session") || "{}");

    if (!session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resume = await withRateLimit(
      RateLimitKey.ResumeUpload,
      session.user.id,
      async () => {
        return await prisma.resume.create({
          data: {
            userId: session.user.id,
            filename,
            fileKey: "",
            profession: jobRole,
          },
        });
      }
    );

    const key = `resumes/${session.user.id}/${resume.id}/${crypto
      .randomUUID()
      .slice(0, 6)}.pdf`;
    const signedUrl = await getSignedUrlForUpload(key, fileType);
    const encodedKey = encodeURIComponent(key);
    await prisma.resume.update({
      where: { id: resume.id },
      data: {
        fileKey: encodedKey,
      },
    });

    inngest.send({
      name: "resume/analyze",
      data: { resumeId: resume.id, userId: session.user.id, jobRole },
    });

    return NextResponse.json({ signedUrl, resumeId: resume.id });
  } catch (error) {
    if (error instanceof RateLimitError) {
      return NextResponse.json(
        { error: error.message },
        { status: 429 }
      );
    }
    return NextResponse.json(
      { error: "Error processing upload request" },
      { status: 500 }
    );
  }
}
