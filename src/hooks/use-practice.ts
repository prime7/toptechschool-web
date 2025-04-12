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
  const [answers, setAnswers] = useState<Record<string, string>>({})
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

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer,
    }))
  }

  const handleNext = () => {
    if (practiceSet && currentQuestionIndex < practiceSet.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handleSubmit = async () => {
    if (!practiceSet) return
    if (Object.values(answers).some(answer => !answer)) return

    setIsSubmitting(true)
    try {
      const practiceTest = {
        practiceSetId: practiceSet.id,
        items: Object.entries(answers).map(([id, answer]) => ({
          question: practiceSet.questions[parseInt(id)].question,
          answer,
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
  }

  return {
    practiceSet,
    isLoading,
    currentQuestionIndex,
    answers,
    isSubmitting,
    totalTimeSpent,
    handleAnswerChange,
    handleNext,
    handleSubmit
  }
} 