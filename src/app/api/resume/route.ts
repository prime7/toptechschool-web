export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = JSON.parse(request.headers.get("x-session") || "{}");

    const resume = await prisma.resume.findMany({
      where: {
        userId: session.user.id,
      },
    });


    if (!resume) {
      return new NextResponse("Resume not found", { status: 404 });
    }

    return NextResponse.json(resume);
  } catch (error) {
    console.error("[RESUME_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
