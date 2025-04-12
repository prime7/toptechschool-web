import { Textarea } from "@/components/ui/textarea"
import { PracticeQuestion } from "@/app/(authenticated)/practice/types"

interface AnswerInputProps {
  question: PracticeQuestion
  answer: string
  onAnswerChange: (value: string) => void
  onSubmit: () => void
  nextInputRef: React.RefObject<HTMLTextAreaElement>
}

export const AnswerInput = ({ answer, onAnswerChange, onSubmit, nextInputRef }: AnswerInputProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault()
      onSubmit()
    }
  }

  return (
    <div className="mt-6 space-y-4">
      <Textarea
        ref={nextInputRef}
        value={answer}
        rows={5}
        onChange={(e) => onAnswerChange(e.target.value)}
        placeholder="Write your answer here... (Press Shift + Enter to submit)"
        className="w-full min-h-[120px] p-4 text-lg resize-y"
        onKeyDown={handleKeyDown}
      />
    </div>
  )
}