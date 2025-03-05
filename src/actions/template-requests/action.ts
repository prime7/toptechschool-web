"use server";

import { prisma } from "@/lib/prisma";
import { TemplateRequestInput, templateRequestSchema } from "./schema";
import { sendTemplateRequestEmail } from "@/lib/resend";

export async function submitTemplateRequest(data: TemplateRequestInput) {
  try {
    const validatedData = templateRequestSchema.parse(data);

    const existingEntry = await prisma.templateRequests.findUnique({
      where: { email: validatedData.email },
    });

    if (existingEntry) {
      return {
        success: false,
        message: "Email already registered in template requests",
      };
    }

    await prisma.templateRequests.create({
      data: { email: validatedData.email },
    });

    await sendTemplateRequestEmail(validatedData.email);

    return {
      success: true,
      message: "Successfully added to template requests",
    };
  } catch (error) {
    console.error("Error submitting to template requests:", error);
    return { success: false, message: "An error occurred. Please try again." };
  }
}
