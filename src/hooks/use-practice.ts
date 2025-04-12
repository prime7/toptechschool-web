import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getPracticeSet } from "@/actions/practice"
import { PracticeSet } from "@/app/(authenticated)/practice/types"
import { useTimer } from "./use-timer"
import axios from "axios"

export const usePractice = (id: string) => {
  const router = useRouter()
  const [practiceSet, setPracticeSet] = useState<PracticeSet | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const totalTimeSpent = useTimer(startTime)

  useEffect(() => {
    const fetchPracticeSet = async () => {
      try {
        const data = await getPracticeSet(id)
        if (!data) {
          router.push("/practice")
          return
        }
        setPracticeSet(data)
        setStartTime(Date.now())
      } catch (error) {
        console.error("Error fetching practice set:", error)
        router.push("/practice")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPracticeSet()
  }, [id, router])

  const isLastQuestion = practiceSet ? currentQuestionIndex === practiceSet.questions.length - 1 : false

  const handleAnswer = async (questionId: number, answer: string) => {
    if (!practiceSet) return

    const newAnswers = { ...answers, [questionId]: answer }
    setAnswers(newAnswers)

    if (isLastQuestion && Object.keys(newAnswers).length === practiceSet.questions.length) {
      setIsSubmitting(true)
      try {
        const practiceTest = {
          practiceSetId: practiceSet.id,
          items: practiceSet.questions.map((question) => ({
            question: question.question,
            answer: newAnswers[question.id]
          })),
          totalTime: totalTimeSpent
        }
        await axios.post(`/api/practice/${id}`, practiceTest)
        router.push(`/practice/${id}/result`)
      } catch (error) {
        console.error("Error submitting practice test:", error)
      } finally {
        setIsSubmitting(false)
      }
    } else if (!isLastQuestion) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  return {
    practiceSet,
    isLoading,
    currentQuestionIndex,
    answers,
    isSubmitting,
    totalTimeSpent,
    isLastQuestion,
    handleAnswer
  }
}