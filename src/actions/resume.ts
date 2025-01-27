"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ResumeAnalysisResult, ResumeFields } from "./parser/types";
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
    fields: ResumeFields[] = ["id", "filename", "createdAt"],
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
      "content",
      "analysis",
    ]
  ): Promise<ResumeAnalysisResult | null> => {
    try {
      const userId = await checkAuthorization();
      const resume = await prisma.resume.findUnique({
        where: { id: resumeId, userId },
        select: Object.fromEntries(fields.map((field) => [field, true])),
      });
      
      if (!resume?.analysis) {
        return null;
      }
      
      return {
        content: resume.content,
        analysis: resume.analysis,
        metadata: {
          analyzedAt: new Date(),
          confidenceScore: 1,
          processingTime: 0
        }
      } as ResumeAnalysisResult;
    } catch (error) {
      throw error;
    }
  }
);

export { getUserResumes, getUserResume };
