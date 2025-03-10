import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { resumeId: string } }
) {
  try {
    const session = JSON.parse(request.headers.get("x-session") || "{}");

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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ resumeId: string }> }
) {
  try {
    const { resumeId } = await params;

    if (!resumeId) {
      return new NextResponse("Resume ID is required", { status: 400 });
    }
    const session = await auth();

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { filename, jobRole } = body;

    const resume = await prisma.resume.findUnique({
      where: {
        id: resumeId,
        userId: session.user.id,
      },
    });

    if (!resume) {
      return new NextResponse("Resume not found", { status: 404 });
    }

    const updatedResume = await prisma.resume.update({
      where: {
        id: resumeId,
      },
      data: {
        filename,
        ...(jobRole && { jobRole }),
      },
    });

    return NextResponse.json(updatedResume);
  } catch (error) {
    console.error("[RESUME_UPDATE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
