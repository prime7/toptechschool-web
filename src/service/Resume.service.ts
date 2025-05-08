import { JobRole } from "@prisma/client";
import { R2Service } from "./R2.service";
import { ResumeWithJobRole } from "@/actions/resume";
import { ResumeEvaluationResult } from "./Evaluation.service";
import { BaseService } from "./Base.service";

export class ResumeService extends BaseService {
  static async getUserResumes(userId: string, options?: {
    take?: number;
    orderBy?: "asc" | "desc";
    select?: string[];
  }): Promise<ResumeWithJobRole[]> {
    return this.handleError(
      async () => {
        const resumes = await this.prisma.resume.findMany({
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
      },
      "Failed to fetch user resumes"
    );
  }

  static async getResumeById(resumeId: string, userId: string) {
    return this.handleError(
      async () => {
        const resume = await this.prisma.resume.findFirst({
          where: { id: resumeId, userId },
        });

        if (!resume) {
          throw new Error("Resume not found");
        }

        return resume;
      },
      "Failed to fetch resume"
    );
  }

  static async createResume(userId: string, data: {
    filename: string;
    fileType: string;
    jobRole?: JobRole;
  }) {
    return this.handleError(
      async () => {
        const resume = await this.prisma.resume.create({
          data: {
            userId,
            filename: data.filename,
            fileKey: "",
            jobRole: data.jobRole,
          },
        });

        const key = `resumes/${userId}/${resume.id}/${crypto.randomUUID().slice(0, 6)}.pdf`;
        const signedUrl = await R2Service.getSignedUrlForUpload(key, data.fileType);
        const encodedKey = encodeURIComponent(key);
        
        await this.prisma.resume.update({
          where: { id: resume.id },
          data: { fileKey: encodedKey },
        });

        return { signedUrl, resumeId: resume.id };
      },
      "Failed to create resume"
    );
  }

  static async updateResume(resumeId: string, userId: string, data: {
    filename?: string;
    jobRole?: JobRole;
  }) {
    return this.handleError(
      async () => {
        await this.validateUserAccess(userId);
        return this.prisma.resume.update({
          where: { id: resumeId },
          data,
        });
      },
      "Failed to update resume"
    );
  }

  static async deleteResume(resumeId: string, userId: string) {
    return this.handleError(
      async () => {
        await this.validateUserAccess(userId);
        return this.prisma.resume.delete({
          where: { id: resumeId },
        });
      },
      "Failed to delete resume"
    );
  }

  static getResumeContentString(resume: { analysis: ResumeEvaluationResult | null }) {
    if (!resume?.analysis) {
      return "";
    }
    const analysis = resume.analysis;
    return [
      ...(Array.isArray(analysis.detailedAreasForImprovement) 
        ? analysis.detailedAreasForImprovement.map(area => area.improvedText) 
        : []),
      ...(Array.isArray(analysis.missingSkills) ? analysis.missingSkills : []),
      ...(Array.isArray(analysis.redFlags) ? analysis.redFlags : [])
    ].filter(Boolean).join(" ");
  }
}