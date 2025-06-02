import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { aiEvaluationService, AIEvaluationResponse } from '@/lib/ai/evaluationService';
import { getQuestionById } from '@/actions/practice'; // To fetch question text
import type { UserQuestionAttempt } from '@prisma/client'; // To type the attempt object

// No longer using PracticeAnswerItem interface from here, will use UserQuestionAttempt type

const evaluateRequestSchema = z.object({
  userQuestionAttemptId: z.string(), // Changed from practiceTestId & questionId
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    const body = await req.json();
    const parsedBody = evaluateRequestSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json({ error: 'Invalid request body', details: parsedBody.error.flatten() }, { status: 400 });
    }

    const { userQuestionAttemptId } = parsedBody.data;

    // 1. Retrieve the UserQuestionAttempt record
    const attempt = await prisma.userQuestionAttempt.findUnique({
      where: {
        id: userQuestionAttemptId,
      },
    });

    if (!attempt) {
      return NextResponse.json({ error: 'Attempt not found.' }, { status: 404 });
    }

    // 2. Verify ownership
    if (attempt.userId !== userId) {
      return NextResponse.json({ error: 'Access denied. You do not own this attempt.' }, { status: 403 });
    }

    // 3. Check for recent evaluations (today) on this specific attempt
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const evaluations = (attempt.evaluations as any[] || []); // Assuming evaluations is Json[]

    const hasRecentEvaluation = evaluations.some(
      (evalRecord: any) => typeof evalRecord.evaluatedAt === 'string' && evalRecord.evaluatedAt.startsWith(today)
    );
    if (hasRecentEvaluation) {
      return NextResponse.json({ error: 'This specific answer has already been evaluated today.' }, { status: 429 });
    }

    // 4. Fetch original question text for the AI service
    const originalQuestion = await getQuestionById(attempt.questionId);
    if (!originalQuestion) {
      // This should ideally not happen if questionId in attempt is valid
      return NextResponse.json({ error: 'Original question details not found.' }, { status: 500 });
    }

    // 5. Integrate with AI service
    const aiResponse: AIEvaluationResponse = await aiEvaluationService.evaluateAnswer({
      question: originalQuestion.question, // Use fetched question text
      answer: attempt.answer,
    });

    // 6. Store evaluation result on the UserQuestionAttempt
    const newEvaluation = {
      evaluatedAt: new Date().toISOString(),
      feedback: aiResponse.feedback,
    };

    const updatedEvaluations = [...evaluations, newEvaluation];

    const updatedAttempt = await prisma.userQuestionAttempt.update({
      where: {
        id: userQuestionAttemptId,
      },
      data: {
        evaluations: updatedEvaluations as any, // Cast to any or Prisma.JsonValue
      },
    });

    return NextResponse.json({
      message: 'Evaluation successful',
      evaluation: newEvaluation, // Return the new evaluation
      attempt: updatedAttempt, // Optionally return the updated attempt
    }, { status: 200 });

  } catch (error) {
    console.error('Error evaluating practice answer:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request body', details: error.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
