import { prisma } from "@/lib/prisma";
import { Resume } from "@prisma/client";

export class ResumeService {
  static async getUserResumes(userId: string) {
    return prisma.resume.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        filename: true,
        jobRole: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
  static async getResumeById(resumeId: string, userId: string) {
    const resume = await prisma.resume.findFirst({
      where: {
        id: resumeId,
        userId,
      },
    });

    if (!resume) {
      throw new Error("Resume not found");
    }

    return resume;
  }

  static getResumeContentString(resume: Resume) {
    return JSON.stringify(resume.content);
  }
} 