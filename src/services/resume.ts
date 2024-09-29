import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ResumeFields } from "./types";
import { cache } from "react";

const checkAuthorization = async () => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session.user.id;
};

export const getUserResumes = cache(
  async (
    fields: ResumeFields[] = ["id", "filename", "createdAt", "url"]
  ): Promise<Partial<Record<ResumeFields, ResumeFields[number]>>[]> => {
    try {
      const userId = await checkAuthorization();
      return await prisma.resume.findMany({
        where: { userId },
        select: Object.fromEntries(fields.map((field) => [field, true])),
        orderBy: { createdAt: "desc" },
        take: 3,
      });
    } catch (error) {
      throw error;
    }
  }
);
