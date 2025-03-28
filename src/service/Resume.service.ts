import { prisma } from "@/lib/prisma";
import { JobRole } from "@prisma/client";
import { getPresignedUrl, getSignedUrlForUpload } from "@/lib/r2";
import axios from "axios";
import pdf from "pdf-parse";
import { EvaluationService, ResumeEvaluationResult } from "./Evaluation.service";
import { ResumeWithJobRole } from "@/actions/resume";

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

  static async analyzeResume(resumeId: string, userId: string, jobRole?: JobRole): Promise<ResumeEvaluationResult> {
    const resume = await this.getResumeById(resumeId, userId);

    if (!resume.fileKey) {
      throw new Error("Resume file not found");
    }

    try {
      await prisma.resume.update({
        where: { id: resumeId },
        data: { parsed: "STARTED" },
      });

      const presignedUrl = await getPresignedUrl(resume.fileKey);
      const response = await axios.get(presignedUrl, {
        timeout: 5000,
        responseType: "arraybuffer",
      });

      if (response.status !== 200) {
        throw new Error(`Failed to fetch resume. Status: ${response.status}`);
      }

      const pdfData = await pdf(response.data);
      const text = pdfData.text;

      if (!text || text.trim().length === 0) {
        throw new Error("No text content found in the PDF");
      }

      const result = await EvaluationService.evaluateResume(text, jobRole ?? null);

      await prisma.resume.update({
        where: { id: resumeId },
        data: {
          analysis: JSON.parse(JSON.stringify(result)),
          parsed: "PARSED",
        },
      });

      return result;
    } catch (error) {
      await prisma.resume.update({
        where: { id: resumeId },
        data: { 
          parsed: "ERROR",
          content: {
            error: error instanceof Error ? error.message : "Unknown error occurred"
          }
        },
      });
      throw error;
    }
  }
} 