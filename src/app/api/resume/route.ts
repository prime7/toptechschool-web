export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from "next/server";
import { ResumeService } from "@/service/Resume.service";

export async function GET(request: NextRequest) {
  try {
    const session = JSON.parse(request.headers.get("x-session") || "{}");
    const resumes = await ResumeService.getUserResumes(session.user.id);
    return NextResponse.json(resumes);
  } catch (error) {
    console.error("[RESUME_GET]", error);
    return NextResponse.json(
      { error: "Error fetching resumes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = JSON.parse(request.headers.get("x-session") || "{}");
    const { filename, fileType, jobRole } = await request.json();
    
    const result = await ResumeService.createResume(session.user.id, {
      filename,
      fileType,
      jobRole,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[RESUME_CREATE]", error);
    return NextResponse.json(
      { error: "Error creating resume" },
      { status: 500 }
    );
  }
}
