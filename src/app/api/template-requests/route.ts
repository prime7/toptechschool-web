import { templateRequestSchema } from "./schema";
import { prisma } from "@/lib/prisma";
import { sendTemplateRequestEmail } from "@/lib/resend";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Log request information for debugging
    console.log(`Processing template request in environment: ${process.env.NODE_ENV}`);
    
    const body = await request.json();
    const validatedData = templateRequestSchema.parse(body);

    // Check if email already exists
    const existingEntry = await prisma.templateRequests.findUnique({
      where: { email: validatedData.email },
    });

    if (existingEntry) {
      return NextResponse.json(
        { message: "Email already registered in template requests" },
        { status: 400 }
      );
    }

    // Create template request
    const templateRequest = await prisma.templateRequests.create({
      data: { 
        id: crypto.randomUUID(),
        email: validatedData.email 
      },
    });

    // Send email with enhanced error handling
    const emailResult = await sendTemplateRequestEmail(validatedData.email);
    
    // If email sending failed, return detailed error
    if (!emailResult.success) {
      console.error("Failed to send email:", emailResult.error);
      
      // Return detailed error information
      return NextResponse.json(
        {
          message: "Template request created but email failed to send",
          error: {
            message: emailResult.error?.message || "Unknown email error",
            code: emailResult.error?.code || "UNKNOWN_ERROR",
            details: emailResult.error?.details || null
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
    // Enhanced error logging
    console.error("Template request error:", error);
    
    // Return more detailed error information
    return NextResponse.json(
      { 
        message: "Internal server error", 
        error: {
          message: error instanceof Error ? error.message : "Unknown error",
          stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : null) : null
        }
      },
      { status: 500 }
    );
  }
}
