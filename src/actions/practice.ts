"use server"

import fs from "fs/promises"
import path from "path"
// Added PracticeQuestion to the import
import { PracticeSet, PracticeQuestion } from "@/app/(authenticated)/practice/types"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { PracticeTest, UserQuestionAttempt } from "@prisma/client" // Moved UserQuestionAttempt import here

// getPracticeSets is primarily used as a helper for getAllQuestions in the new model.
export async function getPracticeSets(): Promise<PracticeSet[]> {
  const filePath = path.join(process.cwd(), "public/data/practice-sets.json")
  const fileContent = await fs.readFile(filePath, "utf-8")
  const data = JSON.parse(fileContent)
  return data.practiceSets as PracticeSet[]
}

export async function getPracticeSet(id: string): Promise<PracticeSet | undefined> {
  const practiceSets = await getPracticeSets()
  return practiceSets.find((set) => set.id === id)
}

export async function getPracticeAttempt(practiceSetId: string): Promise<{ practiceTest: PracticeTest | null }> {
  const session = await auth()
  if (!session?.user?.id) return { practiceTest: null }

  const practiceTest = await prisma.practiceTest.findFirst({
    where: {
      userId: session.user.id,
      practiceSetId
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return {
    practiceTest,
  }
}

export async function getPracticeAttempts(): Promise<PracticeTest[]> {
  const session = await auth()
  if (!session?.user?.id) return []

  const practiceTests = await prisma.practiceTest.findMany({
    where: {
      userId: session.user.id
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return practiceTests
}

// New function to get all questions flattened, with inherited difficulty
// TODO: Future Improvement - Migrate Question Data to Database
// Currently, practice questions are sourced from `public/data/practice-sets.json`.
// This approach has limitations regarding scalability, advanced search/filtering capabilities,
// and content management (CRUD operations for questions).
//
// Recommendation:
// If the question bank is expected to grow significantly or if more advanced features
// (e.g., admin interface for managing questions, complex querying, user-generated content)
// are desired, it's recommended to migrate these questions into a dedicated database table.
// A new Prisma model, for example `PracticeQuestionData`, could be created with fields like
// id, text, type, hints, categories, difficulty, etc.
//
// Benefits of database migration:
// - Improved data management and integrity.
// - Enhanced query performance for large datasets.
// - Easier development of administrative interfaces for question management.
// - Better scalability and support for relational data (e.g., linking questions to specific authors or sources).
//
// This function (`getAllQuestions`) and `getPracticeSets` would then be refactored
// to fetch data from the database instead of the JSON file.
export async function getAllQuestions(): Promise<PracticeQuestion[]> {
  const practiceSets = await getPracticeSets(); // Uses existing function to load sets
  const allQuestions: PracticeQuestion[] = [];

  for (const set of practiceSets) {
    for (const question of set.questions) {
      allQuestions.push({
        ...question,
        // id is already string and globally unique from data file update
        // categories are already part of question from data file update
        difficulty: set.difficulty, // Inherit difficulty from the set
      });
    }
  }
  return allQuestions;
}

export async function getQuestionById(questionId: string): Promise<PracticeQuestion | undefined> {
  const allQuestions = await getAllQuestions();
  return allQuestions.find(q => q.id === questionId);
}

export async function getSavedAnswers(questionId: string): Promise<UserQuestionAttempt[]> {
  const session = await auth();
  if (!session?.user?.id) {
    console.warn("User not authenticated. Cannot fetch saved answers.");
    return [];
  }
  const userId = session.user.id;

  try {
    const attempts = await prisma.userQuestionAttempt.findMany({
      where: {
        userId,
        questionId,
      },
      orderBy: {
        savedAt: 'desc',
      },
    });
    return attempts;
  } catch (error) {
    console.error(`Failed to fetch saved answers for questionId ${questionId} and userId ${userId}:`, error);
    return []; // Return empty array on error
  }
}

// We need to import UserQuestionAttempt type from @prisma/client if it's not already implicitly available
// However, direct import might fail if prisma generate didn't run.
// For now, we assume the return type will be inferred or compatible.
// If explicit type is needed and generate failed, one might use a placeholder type.
// Note: UserQuestionAttempt import was moved to the top.
