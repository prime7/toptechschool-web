import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { resumeId: string } }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { resumeId } = params;

    if (!resumeId) {
      return new NextResponse("Resume ID is required", { status: 400 });
    }

    const resume = await prisma.resume.findUnique({
      where: {
        id: resumeId,
        userId: session.user.id,
      },
    });

    if (!resume) {
      return new NextResponse("Resume not found", { status: 404 });
    }

    await prisma.resume.delete({
      where: {
        id: resumeId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[RESUME_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
