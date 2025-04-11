import { Textarea } from "@/components/ui/textarea"

interface AnswerInputProps {
  question: any
  textAnswer: string
  onAnswerChange: (value: string) => void
  onSubmit: () => void
  nextInputRef: React.RefObject<HTMLTextAreaElement>
}

export const AnswerInput = ({ textAnswer, onAnswerChange, onSubmit, nextInputRef }: AnswerInputProps) => {
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
        value={textAnswer}
        rows={5}
        onChange={(e) => onAnswerChange(e.target.value)}
        placeholder="Write your answer here... (Press Shift + Enter to submit)"
        className="w-full min-h-[120px] p-4 text-lg resize-y"
        onKeyDown={handleKeyDown}
      />
    </div>
  )
}