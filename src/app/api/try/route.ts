import { prisma } from "@/lib/prisma";
import axios from "axios";
import pdf from "pdf-parse";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { resumeId } = await request.json();

    const resume = await prisma.resume.findUniqueOrThrow({
      where: { id: resumeId },
    });

    const response = await axios.get(resume.url, {
      responseType: "arraybuffer",
    });

    const fileBuffer = Buffer.from(response.data);

    const data = await pdf(fileBuffer);
    console.log("PDF parsed successfully, text length:", data.text.length);

    return NextResponse.json({ resume, text: data.text });
  } catch (error) {
    console.error("Error processing resume:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
