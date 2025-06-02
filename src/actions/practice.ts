"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function saveAnswer(questionId: string, answer: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const practiceAnswer = await prisma.practiceAnswer.upsert({
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

  revalidatePath(`/practice/${questionId}`);
  return practiceAnswer;
}

export async function getAnswer(questionId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  const practiceAnswer = await prisma.practiceAnswer.findUnique({
    where: {
      userId_questionId: {
        userId: session.user.id,
        questionId,
      },
    },
  });

  return practiceAnswer;
}

export async function getUserAllAnswers() {
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }

  const answers = await prisma.practiceAnswer.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return answers;
}
