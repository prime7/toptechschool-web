import { templateRequestSchema } from "@/app/api/template-requests";
import { prisma } from "@/lib/prisma";
import { sendTemplateRequestEmail } from "@/lib/resend";
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

    await sendTemplateRequestEmail(validatedData.email);

    return NextResponse.json(
      { message: "Successfully added to template requests" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error handling POST request:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
