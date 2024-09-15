import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseResumeAndAnalyzeATS } from "@/lib/parser";

export async function GET(
  request: NextRequest,
  { params }: { params: { resumeId: string } }
) {
  try {
    const resume = await prisma.resume.findUnique({
      where: {
        id: params.resumeId,
      },
    });

    if (!resume) {
      return NextResponse.json(
        { message: "Resume not found" },
        { status: 404 }
      );
    }

    switch (resume.parsed) {
      case "NOT_STARTED":
        parseResumeAndAnalyzeATS(resume.id).catch(console.error);
        return NextResponse.json({ message: "Resume parsing initiated" });

      case "STARTED":
        return NextResponse.json({ message: "Resume is being parsed" });

      case "PARSED":
        return NextResponse.json({
          message: "Resume parsed successfully",
          content: resume.content,
          atsAnalysis: resume.atsAnalysis,
        });

      case "ERROR":
        return NextResponse.json(
          { message: "Error occurred during parsing" },
          { status: 500 }
        );

      default:
        return NextResponse.json(
          { message: "Unknown resume state" },
          { status: 500 }
        );
    }
  } catch (error) {
    console.error("Error processing resume request:", error);
    return NextResponse.json(
      { error: "Error processing resume request" },
      { status: 500 }
    );
  }
}
