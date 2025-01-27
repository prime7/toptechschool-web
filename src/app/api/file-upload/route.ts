import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSignedUrlForUpload } from "@/lib/r2";

export async function POST(request: Request) {
  try {
    const { filename, fileType } = await request.json();
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const resume = await prisma.resume.create({
      data: {
        userId: session.user.id,
        filename,
        fileKey: "",
      },
    });

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

    return NextResponse.json({ signedUrl, resumeId: resume.id });
  } catch (error) {
    return NextResponse.json(
      { error: "Error processing upload request" },
      { status: 500 }
    );
  }
}
