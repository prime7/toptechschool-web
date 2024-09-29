"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ResumeDetailData, ResumeFields } from "./types";
import { cache } from "react";

const checkAuthorization = async () => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session.user.id;
};

const getUserResumes = cache(
  async (
    fields: ResumeFields[] = ["id", "filename", "createdAt", "url"],
    take: number = 3,
    orderBy: "asc" | "desc" = "desc"
  ): Promise<Partial<Record<ResumeFields, ResumeFields[number]>>[]> => {
    try {
      const userId = await checkAuthorization();
      return await prisma.resume.findMany({
        where: { userId },
        select: Object.fromEntries(fields.map((field) => [field, true])),
        orderBy: { createdAt: orderBy },
        take,
      });
    } catch (error) {
      throw error;
    }
  }
);

const getUserResume = cache(
  async (
    resumeId: string,
    fields: ResumeFields[] = [
      "id",
      "filename",
      "createdAt",
      "url",
      "content",
      "atsAnalysis",
    ]
  ): Promise<ResumeDetailData | null> => {
    try {
      const userId = await checkAuthorization();
      return await prisma.resume.findUnique({
        where: { id: resumeId, userId },
        select: Object.fromEntries(fields.map((field) => [field, true])),
      });
    } catch (error) {
      throw error;
    }
  }
);

export { getUserResumes, getUserResume };
