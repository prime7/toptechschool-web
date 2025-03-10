import { prisma } from "@/lib/prisma";
import { JobRole } from "@prisma/client";
import { EvaluationService } from "./Evaluation.service";
import { ResumeService } from "./Resume.service";

export class JobService {
  static async evaluateJobDescription(
    userId: string,
    jobDescription: string,
    jobRole: JobRole | null,
    resumeId?: string
  ) {
    let resumeData = "";
    if (resumeId) {
      const resume = await ResumeService.getResumeById(resumeId, userId);
      resumeData = ResumeService.getResumeContentString(resume);
    }

    const evaluation = await EvaluationService.evaluateJobMatch(jobDescription, resumeData, jobRole);

    const jobReview = await prisma.jobReview.create({
      data: {
        userId,
        resumeId: resumeId || null,
        matchScore: evaluation.matchScore,
        missingKeywords: evaluation.missingKeywords,
        suggestions: evaluation.suggestions,
      },
    });

    return {
      jobReview,
      evaluation,
    };
  }

  static async getUserJobReviews(userId: string) {
    return prisma.jobReview.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
