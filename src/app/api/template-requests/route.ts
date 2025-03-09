import { templateRequestSchema } from "./schema";
import { prisma } from "@/lib/prisma";
import { sendTemplateRequestEmail } from "@/actions/email";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = templateRequestSchema.parse(body);

    const existingEntry = await prisma.templateRequests.findUnique({
      where: { email: validatedData.email },
    });

    if (existingEntry) {
      return NextResponse.json(
        { message: "Email already registered in template requests" },
        { status: 400 }
      );
    }

    await prisma.templateRequests.create({
      data: { email: validatedData.email },
    });

    const emailResult = await sendTemplateRequestEmail(validatedData.email);

    if (!emailResult.success) {
      console.error("Failed to send email:", emailResult.error);
      return NextResponse.json(
        { message: emailResult.error },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Successfully added to template requests" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
