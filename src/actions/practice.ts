"use server"

import fs from "fs/promises"
import path from "path"
import { PracticeSet } from "@/app/(authenticated)/practice/types"

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