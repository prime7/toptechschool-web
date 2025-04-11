"use client"

import { usePractice } from "@/hooks/use-practice"
import { useState, useEffect, useRef } from "react"
import { Timer } from "lucide-react"
import { Progress } from '@/components/ui/progress'
import { QuestionCard } from "./components/QuestionCard"
import { AnswerInput } from "./components/AnswerInput"
import { SubmitButton } from "./components/SubmitButton"
import { LoadingSpinner } from "@/components/common/LoadingSpinner"

export default function PracticeStartPage({ params }: { params: { id: string } }) {
  const {
    result,
    practiceSet,
    isLoading,
    currentQuestionIndex,
    answers,
    isSubmitting,
    totalTimeSpent,
    handleAnswerChange,
    handleNext,
    handleSubmit
  } = usePractice(params.id)

  const [selectedAnswer, setSelectedAnswer] = useState("")
  const [textAnswer, setTextAnswer] = useState("")
  const currentQuestionRef = useRef<HTMLDivElement>(null)
  const nextInputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && e.shiftKey && (selectedAnswer || textAnswer)) {
        handleAnswerSubmit()
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [selectedAnswer, textAnswer])

  useEffect(() => {
    if (currentQuestionRef.current) {
      currentQuestionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
      nextInputRef.current?.focus()
    }
  }, [currentQuestionIndex])

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!practiceSet) {
    return null
  }

  if (result) {
    return (
      <div className="min-h-[calc(100vh-5rem)] py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white dark:bg-gray-800 rounded-sm shadow-xl p-6 space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Overall Score</h2>
              <div className="text-4xl font-bold">{result.overallScore}%</div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Strengths</h2>
              <ul className="list-disc pl-5 space-y-2">
                {result.strengths.map((strength, i) => (
                  <li key={i} className="text-green-600 dark:text-green-400">{strength}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Areas for Improvement</h2>
              <ul className="list-disc pl-5 space-y-2">
                {result.gaps.map((gap, i) => (
                  <li key={i} className="text-red-600 dark:text-red-400">{gap}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Recommendations</h2>
              <ul className="list-disc pl-5 space-y-2">
                {result.recommendations.map((rec, i) => (
                  <li key={i} className="text-blue-600 dark:text-blue-400">{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const handleAnswerSubmit = () => {
    const currentQuestion = practiceSet.questions[currentQuestionIndex]
    const answer = currentQuestion.type === 'text' ? textAnswer : selectedAnswer
    handleAnswerChange(currentQuestion.id, answer)
    setSelectedAnswer("")
    setTextAnswer("")
    handleNext()
  }

  const progress = ((currentQuestionIndex) / practiceSet.questions.length) * 100

  return (
    <div className="min-h-[calc(100vh-5rem)] py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Progress value={progress} className="h-1" />
        <div className="bg-white dark:bg-gray-800 rounded-sm shadow-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="rounded-full font-semibold flex items-center gap-2">
              {currentQuestionIndex + 1} / {practiceSet.questions.length}
            </span>
            <span className="rounded-full font-mono flex items-center gap-2">
              <Timer size={18} />
              {Math.floor(totalTimeSpent / 60)}:{(totalTimeSpent % 60).toString().padStart(2, '0')}
            </span>
          </div>

          <div className="space-y-6">
            {practiceSet.questions.slice(0, currentQuestionIndex + 1).map((question, index) => (
              <div
                key={question.id}
                ref={index === currentQuestionIndex ? currentQuestionRef : null}
              >
                <QuestionCard
                  question={question}
                  index={index}
                  hints={question.hints}
                  isCurrentQuestion={index === currentQuestionIndex}
                  answer={answers[question.id]}
                >
                  {index === currentQuestionIndex && (
                    <AnswerInput
                      question={question}
                      textAnswer={textAnswer}
                      onAnswerChange={value => question.type === 'text' ? setTextAnswer(value) : setSelectedAnswer(value)}
                      onSubmit={handleAnswerSubmit}
                      nextInputRef={nextInputRef}
                    />
                  )}
                </QuestionCard>
              </div>
            ))}
          </div>
          <SubmitButton
            isLastQuestion={currentQuestionIndex === practiceSet.questions.length - 1}
            isSubmitting={isSubmitting}
            disabled={!selectedAnswer && !textAnswer}
            onClick={currentQuestionIndex === practiceSet.questions.length - 1 ? handleSubmit : handleAnswerSubmit}
          />
        </div>
      </div>
    </div>
  )
}