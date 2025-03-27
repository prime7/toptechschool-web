"use server";

import { prisma } from "@/lib/prisma";
import { newsletterSchema, NewsletterInput } from "./schema";

export async function submitToNewsletter(data: NewsletterInput) {
  try {
    const validatedData = newsletterSchema.parse(data);

    const existingEntry = await prisma.newsletter.findUnique({
      where: { email: validatedData.email },
    });

    if (existingEntry) {
      return {
        success: false,
        message: "Email already registered in newsletter",
      };
    }

    await prisma.newsletter.create({
      data: { email: validatedData.email },
    });

    return { success: true, message: "Successfully added to newsletter" };
  } catch (error) {
    console.error("Error submitting to newsletter:", error);
    return { success: false, message: "An error occurred. Please try again." };
  }
}
