import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSignedUrlForUpload } from "@/lib/r2";
import { ResumeService } from "@/service/Resume.service";

export async function POST(request: Request) {
  try {
    const { filename, jobRole } = await request.json();
    const session = JSON.parse(request.headers.get("x-session") || "{}");

    const resume = await prisma.resume.create({
      data: {
        userId: session.user.id,
        filename,
        fileKey: "",
        jobRole,
      },
    });

    const key = `resumes/${session.user.id}/${resume.id}/${crypto
      .randomUUID()
      .slice(0, 6)}.pdf`;
    const signedUrl = await getSignedUrlForUpload(key);
    // const signedUrl = await getSignedUrlForUpload(key, fileType);
    const encodedKey = encodeURIComponent(key);
    await prisma.resume.update({
      where: { id: resume.id },
      data: {
        fileKey: encodedKey,
      },
    });

    ResumeService.analyzeResume(resume.id, session.user.id, jobRole).catch(console.error);

    return NextResponse.json({ signedUrl, resumeId: resume.id });
  } catch (error) {
    return NextResponse.json(
      { error: "Error processing upload request" },
      { status: 500 }
    );
  }
}
