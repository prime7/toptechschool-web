import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { EvaluationService } from "@/service/Evaluation.service"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { practiceSetId, items, totalTime } = await request.json()
  const result = await EvaluationService.analyzePracticeTest(practiceSetId, items)
  await prisma.practiceTest.create({
    data: {
      practiceSetId: practiceSetId,
      items: items,
      totalTime: totalTime,
      userId: session.user.id,
      aiAnalysis: JSON.parse(JSON.stringify(result))
    }
  })
  return NextResponse.json({ data: result, message: "Practice test evaluated", success: true }, { status: 200 })
}