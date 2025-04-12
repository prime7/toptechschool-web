"use server"

import fs from "fs/promises"
import path from "path"
import { PracticeSet } from "@/app/(authenticated)/practice/types"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { PracticeTest } from "@prisma/client"

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
