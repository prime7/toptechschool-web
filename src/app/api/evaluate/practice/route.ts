import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { EvaluationService } from "@/service/Evaluation.service";
import {
  RateLimitError,
  withRateLimit,
  RateLimitKey,
} from "@/lib/redis/rate-limit";
import { prisma } from "@/lib/prisma";
import { questions } from "@/app/(authenticated)/practice/data";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const { questionId, answer } = data;
    if (!questionId || !answer) {
      return NextResponse.json(
        { message: "Question ID and answer are required" },
        { status: 400 }
      );
    }

    const question = questions.find((q) => q.id === questionId)?.title || "";

    const result = await withRateLimit(
      RateLimitKey.PracticeAnalyze,
      session.user.id,
      async () => {
        return await EvaluationService.analyzePracticeAnswer(
          question,
          answer,
          session.user.id
        );
      }
    );
    console.log(result);
    try {
      await prisma.practiceAnswer.upsert({
      where: {
        userId_questionId: {
          userId: session.user.id,
          questionId,
        },
      },
      update: {
        answer,
        aiAnswer: answer,
        feedback: result.feedback,
        score: result.score,
        suggestions: result.suggestions,
        updatedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        questionId,
        answer,
        aiAnswer: answer,
        feedback: result.feedback,
        score: result.score,
        suggestions: result.suggestions,
      },
    });
    } catch (error) {
      console.error("Error upserting practice answer", error);
    }

    return NextResponse.json(result);

  } catch (error) {
    if (error instanceof RateLimitError) {
      return NextResponse.json({ message: error.message }, { status: 429 });
    }

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const { questionId, answer } = data;
    if (!questionId || !answer) {
      return NextResponse.json(
        { message: "Question ID and answer are required" },
        { status: 400 }
      );
    }

    await prisma.practiceAnswer.upsert({
      where: {
        userId_questionId: {
          userId: session.user.id,
          questionId,
        },
      },
      update: {
        answer,
        updatedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        questionId,
        answer,
      },
    });

    return NextResponse.json(
      { message: "Answer saved successfully" },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}