import { NextRequest, NextResponse } from "next/server";
import { ResumeService } from "@/service/Resume.service";

export async function GET(
  request: NextRequest,
  { params }: { params: { resumeId: string } }
) {
  try {
    const session = JSON.parse(request.headers.get("x-session") || "{}");
    const resume = await ResumeService.getResumeById(params.resumeId, session.user.id);
    return NextResponse.json(resume);
  } catch (error) {
    if (error instanceof Error && error.message === "Resume not found") {
      return NextResponse.json(
        { error: "Resume not found" },
        { status: 404 }
      );
    }
    console.error("[RESUME_GET_BY_ID]", error);
    return NextResponse.json(
      { error: "Error fetching resume" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { resumeId: string } }
) {
  try {
    const session = JSON.parse(request.headers.get("x-session") || "{}");

    if (!session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await ResumeService.deleteResume(params.resumeId, session.user.id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof Error && error.message === "Resume not found") {
      return NextResponse.json(
        { error: "Resume not found" },
        { status: 404 }
      );
    }
    console.error("[RESUME_DELETE]", error);
    return NextResponse.json(
      { error: "Error deleting resume" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { resumeId: string } }
) {
  try {
    const session = JSON.parse(request.headers.get("x-session") || "{}");
    const body = await request.json();
    const { filename, profession } = body;

    const updatedResume = await ResumeService.updateResume(
      params.resumeId,
      session.user.id,
      { filename, profession }
    );

    return NextResponse.json(updatedResume);
  } catch (error) {
    if (error instanceof Error && error.message === "Resume not found") {
      return NextResponse.json(
        { error: "Resume not found" },
        { status: 404 }
      );
    }
    console.error("[RESUME_UPDATE]", error);
    return NextResponse.json(
      { error: "Error updating resume" },
      { status: 500 }
    );
  }
}
