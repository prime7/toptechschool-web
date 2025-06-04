import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { EvaluationService } from "@/service/Evaluation.service";
import { RateLimitError, withRateLimit, RateLimitKey } from "@/lib/redis/rate-limit";
import { prisma } from "@/lib/prisma";

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

    // Save the evaluation results to the database
    await prisma.practiceAnswer.upsert({
      where: {
        userId_questionId: {
          userId: session.user.id,
          questionId,
        },
      },
      update: {
        answer,
        feedback: result.feedback,
        score: result.score,
        suggestions: result.suggestions,
        updatedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        questionId,
        answer,
        feedback: result.feedback,
        score: result.score,
        suggestions: result.suggestions,
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return NextResponse.json(
        { message: error.message },
        { status: 429 }
      );
    }

    console.error("Error processing practice answer:", error);
    return NextResponse.json(
      { message: "Failed to evaluate practice answer" },
      { status: 500 }
    );
  }
}