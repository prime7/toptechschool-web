"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateUserInterests(interests: string[]) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { interests },
    });

    revalidatePath("/recommendations");

    return { success: true };
  } catch (error) {
    console.error("Error updating user interests:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}
