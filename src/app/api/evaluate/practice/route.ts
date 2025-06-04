import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { EvaluationService } from "@/service/Evaluation.service";
import { RateLimitError, withRateLimit, RateLimitKey } from "@/lib/redis/rate-limit";
import { prisma } from "@/lib/prisma";

interface PracticeAnswerResult {
  feedback: string;
  score: number;
  suggestions: string[];
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const requestData = await request.json();
    const { questionId, answer, withAIFeedback = false } = requestData;

    if (!questionId || !answer) {
      return NextResponse.json(
        { message: "Question ID and answer are required" },
        { status: 400 }
      );
    }

    let result: PracticeAnswerResult = {
      feedback: "",
      score: 0,
      suggestions: [],
    };

    if (withAIFeedback) {
      result = await withRateLimit(
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
    }

    const savedAnswer = await prisma.practiceAnswer.upsert({
      where: {
        userId_questionId: {
          userId: session.user.id,
          questionId,
        },
      },
      update: {
        answer,
        ...(withAIFeedback && {
          feedback: result.feedback,
          score: result.score,
          suggestions: result.suggestions,
        }),
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

    return NextResponse.json(withAIFeedback ? result : { 
      message: "Answer saved successfully",
      answer: savedAnswer 
    });
  } catch (error) {
    if (error instanceof RateLimitError) {
      return NextResponse.json(
        { message: error.message },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { 
        message:  "Something went wrong", 
        error: error,
      },
      { status: 500 }
    );
  }
}
