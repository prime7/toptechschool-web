"use client"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { usePractice } from "@/hooks/use-practice"
import { useState } from "react"

export default function PracticeStartPage({ params }: { params: { id: string } }) {
  const {
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

  const [currentAnswer, setCurrentAnswer] = useState("")

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!practiceSet) {
    return null
  }

  const handleAnswerSubmit = () => {
    handleAnswerChange(practiceSet.questions[currentQuestionIndex].id, currentAnswer)
    setCurrentAnswer("")
    handleNext()
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col h-[80vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            Question {currentQuestionIndex + 1} of {practiceSet.questions.length}
          </h2>
          <div className="text-sm font-medium">
            Time: {Math.floor(totalTimeSpent / 60)}:{(totalTimeSpent % 60).toString().padStart(2, '0')}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {practiceSet.questions.slice(0, currentQuestionIndex + 1).map((question, index) => (
            <div key={question.id} className="space-y-2">
              <div className="bg-primary/10 p-4 rounded-lg">
                <p className="font-medium">Question {index + 1}:</p>
                <p>{question.question}</p>
              </div>
              {answers[question.id] && (
                <div className="bg-secondary/10 p-4 rounded-lg ml-8">
                  <p className="font-medium">Your Answer:</p>
                  <p>{answers[question.id]}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {currentQuestionIndex < practiceSet.questions.length && (
          <div className="border-t pt-4">
            <div className="flex gap-2">
              <Textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="flex-1"
              />
              <Button 
                onClick={handleAnswerSubmit}
                disabled={!currentAnswer.trim()}
                className="bg-primary hover:bg-primary/90"
              >
                Send
              </Button>
            </div>
          </div>
        )}

        {currentQuestionIndex === practiceSet.questions.length && (
          <div className="flex justify-end mt-4">
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? "Submitting..." : "Submit All Answers"}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}