import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { parseResumeAndAnalyzeATS } from "@/lib/parser";
import UploadService from "./upload";

class ResumeService {
  private uploadService: UploadService;

  constructor() {
    this.uploadService = new UploadService();
  }

  private async checkAuthorization() {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }
    return session.user.id;
  }

  async getResumesByUserId(userId: string) {
    try {
      await this.checkAuthorization();
      return await prisma.resume.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      console.error("Error fetching resumes:", error);
      throw error;
    }
  }

  async getResumeById(resumeId: string) {
    try {
      const userId = await this.checkAuthorization();
      const resume = await prisma.resume.findUnique({
        where: { id: resumeId, userId },
      });
      if (!resume) {
        throw new Error("Resume not found or unauthorized");
      }
      return resume;
    } catch (error) {
      console.error("Error fetching resume:", error);
      throw error;
    }
  }

  async createResume(filename: string, fileType: string) {
    try {
      const userId = await this.checkAuthorization();
      return await this.uploadService.uploadResume(userId, filename, fileType);
    } catch (error) {
      console.error("Error creating resume:", error);
      throw error;
    }
  }

  async deleteResume(resumeId: string) {
    try {
      const userId = await this.checkAuthorization();
      const result = await prisma.resume.deleteMany({
        where: { id: resumeId, userId },
      });
      if (result.count === 0) {
        throw new Error("Resume not found or unauthorized");
      }
    } catch (error) {
      console.error("Error deleting resume:", error);
      throw error;
    }
  }

  async getResumeWithParsing(resumeId: string) {
    try {
      await this.checkAuthorization();
      const resume = await prisma.resume.findUnique({
        where: { id: resumeId },
      });

      if (!resume) {
        throw new Error("Resume not found");
      }

      let response;

      switch (resume.parsed) {
        case "NOT_STARTED":
          parseResumeAndAnalyzeATS(resume.id).catch(console.error);
          response = { message: "Resume parsing initiated" };
          break;
        case "STARTED":
          response = { message: "Resume is being parsed" };
          break;
        case "PARSED":
          response = {
            message: "Resume parsed successfully",
            content: resume.content,
            atsAnalysis: resume.atsAnalysis,
          };
          break;
        case "ERROR":
          response = { message: "Error occurred during parsing" };
          break;
        default:
          response = { message: "Unknown resume state" };
      }

      return response;
    } catch (error) {
      console.error("Error processing resume request:", error);
      throw error;
    }
  }
}

export default ResumeService;
