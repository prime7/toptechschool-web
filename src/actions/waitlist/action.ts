"use server";

import { prisma } from "@/lib/prisma";
import { waitlistSchema, WaitlistInput } from "./schema";

export async function submitToWaitlist(data: WaitlistInput) {
  try {
    const validatedData = waitlistSchema.parse(data);

    const existingEntry = await prisma.waitlist.findUnique({
      where: { email: validatedData.email },
    });

    if (existingEntry) {
      return {
        success: false,
        message: "Email already registered in waitlist",
      };
    }

    await prisma.waitlist.create({
      data: { email: validatedData.email },
    });

    return { success: true, message: "Successfully added to waitlist" };
  } catch (error) {
    console.error("Error submitting to waitlist:", error);
    return { success: false, message: "An error occurred. Please try again." };
  }
}
