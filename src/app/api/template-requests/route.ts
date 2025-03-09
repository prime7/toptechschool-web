import TemplateRequestEmail from "@/emails/TemplateRequestEmail";
import { templateRequestSchema } from "./schema";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { resend } from "@/lib/resend";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { success, data, error } = templateRequestSchema.safeParse(body);
    
    if (!success) {
      return NextResponse.json(
        { message: "Invalid input", errors: error?.flatten().fieldErrors },
        { status: 400 }
      );
    }
    
    const { email } = data;

    const existingEntry = await prisma.templateRequests.findUnique({
      where: { email },
    });

    if (existingEntry) {
      return NextResponse.json(
        { message: "Email already registered in template requests" },
        { status: 400 }
      );
    }

    const emailResult = await resend.emails.send({
      from: process.env.NODE_ENV === 'production' 
        ? "Toptechschool <support@toptechschool.com>"
        : "Toptechschool <onboarding@resend.dev>",
      to: email,
      subject: "Access your lean Startup Notion template",
      react: TemplateRequestEmail({ to: email }),
    });


    const templateRequest = await prisma.templateRequests.create({
      data: { email },
    });


    if (!emailResult || emailResult.error) {
      await prisma.templateRequests.delete({
        where: { id: templateRequest.id },
      });
      
      return NextResponse.json(
        { 
          message: "Failed to send template email", 
          error: emailResult?.error?.message || "Unknown email error"
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
      { message: "Internal server error", error: (error as Error).message },
      { status: 500 }
    );
  }
}
