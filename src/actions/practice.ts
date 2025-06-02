"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function saveAnswer(questionId: string, answer: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const practiceAnswer = await prisma.practiceAnswer.upsert({
    where: {
      userId_questionId: {
        userId: session.user.id,
        questionId
      }
    },
    update: {
      answer,
      updatedAt: new Date()
    },
    create: {
      userId: session.user.id,
      questionId,
      answer
    }
  })

  revalidatePath(`/practice/question/${questionId}`)
  return practiceAnswer
}

export async function getAnswer(questionId: string) {
  const session = await auth()
  if (!session?.user?.id) {
    return null
  }

  const practiceAnswer = await prisma.practiceAnswer.findUnique({
    where: {
      userId_questionId: {
        userId: session.user.id,
        questionId
      }
    }
  })

  return practiceAnswer
}

export async function generateFeedback(questionId: string, answer: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  let practiceAnswer = await prisma.practiceAnswer.findUnique({
    where: {
      userId_questionId: {
        userId: session.user.id,
        questionId
      }
    }
  })

  if (!practiceAnswer) {
    practiceAnswer = await prisma.practiceAnswer.create({
      data: {
        userId: session.user.id,
        questionId,
        answer
      }
    })
  } else if (practiceAnswer.answer !== answer) {
    practiceAnswer = await prisma.practiceAnswer.update({
      where: { id: practiceAnswer.id },
      data: { answer }
    })
  }

  try {
    const feedbackData = await generateAIFeedback(answer, questionId)
    
    await prisma.practiceAnswer.update({
      where: { id: practiceAnswer.id },
      data: {
        feedback: feedbackData.feedback,
        score: feedbackData.score,
        suggestions: feedbackData.suggestions || []
      }
    })

    revalidatePath(`/practice/question/${questionId}`)
    return feedbackData
  } catch (error) {
    console.error("Error generating AI feedback:", error)
    throw new Error("Failed to generate feedback")
  }
}

async function generateAIFeedback(answer: string, questionId: string) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an expert interview coach providing feedback on behavioral interview answers. 
          Analyze the answer and provide constructive feedback focusing on:
          1. Overall quality and structure
          2. Use of STAR method (Situation, Task, Action, Result) if applicable
          3. Specific examples and details
          4. Areas for improvement
          5. Strengths demonstrated
          
          Provide a score from 1-10 and specific, actionable suggestions.
          
          Return your response as a JSON object with the following structure:
          {
            "feedback": "Overall feedback text",
            "score": 8,
            "suggestions": ["suggestion1", "suggestion2"]
          }`
        },
        {
          role: 'user',
          content: `Please provide feedback on this interview answer:
          
          Question ID: ${questionId}
          
          Answer: ${answer}`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    })
  })

  if (!response.ok) {
    throw new Error('Failed to generate AI feedback')
  }

  const data = await response.json()
  const content = data.choices[0]?.message?.content

  try {
    return JSON.parse(content)
  } catch (error) {
    return {
      feedback: content || "Unable to generate structured feedback",
      score: null,
      suggestions: []
    }
  }
}

export async function getUserAllAnswers() {
  const session = await auth()
  if (!session?.user?.id) {
    return []
  }

  const answers = await prisma.practiceAnswer.findMany({
    where: {
      userId: session.user.id
    },
    orderBy: {
      updatedAt: 'desc'
    }
  })

  return answers
} 