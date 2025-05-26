import { NextRequest, NextResponse } from "next/server";
import { RateLimitKey } from "@/lib/redis/rate-limit";
import { withRateLimit } from "@/lib/redis/rate-limit";
import { auth } from "@/lib/auth";
import { EvaluationService } from "@/service/Evaluation.service";

export async function POST(request: NextRequest) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { jobDescription, jobRole, resumeId } = await request.json();
  if (!jobDescription) {
    return NextResponse.json({ error: "Job description[jobDescription] is required" }, { status: 400 });
  }

  try {
    const result = await withRateLimit(
      RateLimitKey.JobAnalyze,
      session.user.id,
      async () => {
        const resumeEvaluation = await EvaluationService.evaluateResume(
          jobDescription,
          jobRole,
          session.user.id
        );

        return {
          jobReview: {
            userId: session.user.id,
            resumeId: resumeId || null,
            matchScore: resumeEvaluation.overallScore,
            missingKeywords: resumeEvaluation.missingSkills,
            suggestions: resumeEvaluation.detailedAreasForImprovement.map(area => area.improvedText),
          },
          evaluation: resumeEvaluation
        };
      }
    );

    return NextResponse.json({
      message: "Job description evaluated successfully",
      jobReview: result.jobReview,
      evaluation: result.evaluation
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
