import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { EvaluationService } from "@/service/Evaluation.service";
import { RateLimitError, withRateLimit, RateLimitKey } from "@/lib/redis/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { questionId, answer } = await request.json();

    if (!questionId || !answer) {
      return NextResponse.json(
        { message: "Question ID and answer are required" },
        { status: 400 }
      );
    }

    const result = await withRateLimit(
      RateLimitKey.PracticeAnalyze,
      session.user.id,
      async () => {
        return await EvaluationService.analyzePracticeAnswer(
          questionId,
          answer,
          session.user.id
        );
      }
    );

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return NextResponse.json(
        { message: error.message },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { message: "Failed to evaluate practice answer" },
      { status: 500 }
    );
  }
}