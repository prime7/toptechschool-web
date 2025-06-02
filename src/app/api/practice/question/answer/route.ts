import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const saveAnswerSchema = z.object({
  questionId: z.string(),
  answer: z.string().min(1, { message: "Answer cannot be empty." }), // Basic validation
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    const body = await req.json();
    const parsedBody = saveAnswerSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json({ error: 'Invalid request body', details: parsedBody.error.flatten() }, { status: 400 });
    }

    const { questionId, answer } = parsedBody.data;

    // For now, evaluations will be empty. This can be extended later.
    const newAttempt = await prisma.userQuestionAttempt.create({
      data: {
        userId,
        questionId,
        answer,
        evaluations: [], // Initialize with empty evaluations
        // savedAt and updatedAt are handled by Prisma defaults/updates
      },
    });

    return NextResponse.json({ message: 'Answer saved successfully', attempt: newAttempt }, { status: 201 });

  } catch (error) {
    console.error('Error saving question answer:', error);
    // It's good to check if the error is a Prisma-specific error for more detailed messages
    // For example, if (error instanceof Prisma.PrismaClientKnownRequestError) { ... }
    // But for now, a generic error is fine.
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
