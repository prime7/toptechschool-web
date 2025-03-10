import { templateRequestSchema } from "./schema";
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

    const templateRequest = await prisma.templateRequests.create({
      data: { 
        id: crypto.randomUUID(),
        email: validatedData.email 
      },
    });

    const emailResult = await sendTemplateRequestEmail(validatedData.email);
    
    if (!emailResult.success) {
      return NextResponse.json(
        {
          message: "Template request created but email failed to send",
          error: {
            message: emailResult.error?.message || "Unknown email error"
          },
          data: { requestId: templateRequest.id }
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        message: "Successfully added to template requests",
        data: { requestId: templateRequest.id }
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { 
        message: "Internal server error", 
        error: {
          message: error instanceof Error ? error.message : "Unknown error"
        }
      },
      { status: 500 }
    );
  }
}
