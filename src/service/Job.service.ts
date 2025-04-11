import { JobRole } from "@prisma/client";
import { EvaluationService, ResumeEvaluationResult } from "./Evaluation.service";
import { ResumeService } from "./Resume.service";
import { BaseService } from "./Base.service";

export class JobService extends BaseService {
  static async evaluateJobDescription(
    userId: string,
    jobDescription: string,
    jobRole: JobRole | null,
    resumeId?: string
  ) {
    return this.handleError(
      async () => {
        let resumeData = "";
        if (resumeId) {
          const resume = await ResumeService.getResumeById(resumeId, userId);
          resumeData = ResumeService.getResumeContentString(resume as unknown as { analysis: ResumeEvaluationResult | null });
        }

        const evaluation = await EvaluationService.evaluateJobMatch(
          jobDescription,
          resumeData,
          jobRole,
          userId
        );

        const jobReview = await this.prisma.jobReview.create({
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
      },
      "Failed to evaluate job description"
    );
  }

  static async getUserJobReviews(userId: string) {
    return this.handleError(
      async () => {
        return this.prisma.jobReview.findMany({
          where: {
            userId,
          },
          orderBy: {
            createdAt: 'desc',
          },
        });
      },
      "Failed to fetch user job reviews"
    );
  }
}
