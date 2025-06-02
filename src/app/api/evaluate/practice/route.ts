import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { EvaluationService } from "@/service/Evaluation.service";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { questionId, answer } = await request.json();

    if (!questionId || !answer) {
      return NextResponse.json(
        { error: "Question ID and answer are required" },
        { status: 400 }
      );
    }

    const result = await EvaluationService.analyzePracticeAnswer(
      questionId,
      answer,
      session.user.id
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error evaluating practice answer:", error);
    return NextResponse.json(
      { error: "Failed to evaluate practice answer" },
      { status: 500 }
    );
  }
} 