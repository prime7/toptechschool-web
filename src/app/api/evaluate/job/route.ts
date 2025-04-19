import { NextRequest, NextResponse } from "next/server";
import { JobService } from "@/service/Job.service";
import { RateLimitKey } from "@/lib/redis/rate-limit";
import { withRateLimit } from "@/lib/redis/rate-limit";

export async function POST(request: NextRequest) {
  const session = JSON.parse(request.headers.get("x-session") || "{}");

  const { jobDescription, jobRole, resumeId } = await request.json();
  if (!jobDescription) {
    return NextResponse.json({ error: "Job description[jobDescription] is required" }, { status: 400 });
  }

  try {
    const result = await withRateLimit(
      RateLimitKey.JobAnalyze,
      session.user.id,
      async () => {
        return await JobService.evaluateJobDescription(
          session.user.id,
          jobDescription,
          jobRole,
          resumeId
        );
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
