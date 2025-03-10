import { prisma } from "@/lib/prisma";
import { JobRole } from "@prisma/client";
import { EvaluationService } from "./Evaluation.service";

export class JobService {
  /**
   * Evaluates a job description against a resume and stores the results
   */
  static async evaluateJobDescription(
    userId: string,
    jobDescription: string,
    jobRole: JobRole | null,
    resumeId?: string
  ) {
    // Get resume data if resumeId is provided
    let resumeData = "";
    if (resumeId) {
      const resume = await prisma.resume.findFirst({
        where: {
          id: resumeId,
          userId: userId,
        },
      });

      if (!resume) {
        throw new Error("Resume not found");
      }

      resumeData = JSON.stringify(resume.content);
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
}
