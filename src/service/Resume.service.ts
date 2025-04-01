import { prisma } from "@/lib/prisma";
import { JobRole } from "@prisma/client";
import { getSignedUrlForUpload } from "@/lib/r2";
import { ResumeWithJobRole } from "@/actions/resume";
import { ResumeEvaluationResult } from "./Evaluation.service";

export class ResumeService {
  static async getUserResumes(userId: string, options?: {
    take?: number;
    orderBy?: "asc" | "desc";
    select?: string[];
  }): Promise<ResumeWithJobRole[]> {
    const resumes = await prisma.resume.findMany({
      where: { userId },
      select: {
        id: true,
        filename: true,
        jobRole: true,
        createdAt: true,
      },
      orderBy: options?.orderBy ? { createdAt: options.orderBy } : undefined,
      take: options?.take,
    });

    return resumes;
  }

  static async getResumeById(resumeId: string, userId: string) {
    const resume = await prisma.resume.findFirst({
      where: { id: resumeId, userId },
    });

    if (!resume) {
      throw new Error("Resume not found");
    }

    return resume;
  }

  static async createResume(userId: string, data: {
    filename: string;
    fileType: string;
    jobRole?: JobRole;
  }) {
    const resume = await prisma.resume.create({
      data: {
        userId,
        filename: data.filename,
        fileKey: "",
        jobRole: data.jobRole,
      },
    });

    const key = `resumes/${userId}/${resume.id}/${crypto.randomUUID().slice(0, 6)}.pdf`;
    const signedUrl = await getSignedUrlForUpload(key, data.fileType);
    const encodedKey = encodeURIComponent(key);
    
    await prisma.resume.update({
      where: { id: resume.id },
      data: { fileKey: encodedKey },
    });

    return { signedUrl, resumeId: resume.id };
  }

  static async updateResume(resumeId: string, userId: string, data: {
    filename?: string;
    jobRole?: JobRole;
  }) {
    return prisma.resume.update({
      where: { id: resumeId },
      data,
    });
  }

  static async deleteResume(resumeId: string, userId: string) {
    const resume = await this.getResumeById(resumeId, userId);
    
    if (!resume) {
      throw new Error("Resume not found");
    }

    return prisma.resume.delete({
      where: { id: resumeId },
    });
  }

  static getResumeContentString(resume: { analysis: ResumeEvaluationResult | null }) {
    if (!resume?.analysis) {
      return "";
    }
    const analysis = resume.analysis;
    return [
      ...(Array.isArray(analysis.strengths) ? analysis.strengths : []),
      ...(Array.isArray(analysis.gaps) ? analysis.gaps : []),
      typeof analysis.recommendations === 'string' ? analysis.recommendations : ""
    ].filter(Boolean).join(" ");
  }
} 