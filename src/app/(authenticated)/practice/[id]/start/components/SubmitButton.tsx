import { Button } from "@/components/ui/button"
import { ChevronRight, CheckCircle } from "lucide-react"

interface SubmitButtonProps {
  isLastQuestion: boolean
  isSubmitting: boolean
  disabled: boolean
  onClick: () => void
}

export const SubmitButton = ({ isLastQuestion, isSubmitting, disabled, onClick }: SubmitButtonProps) => {
  return (
    <div className="flex justify-end mt-8">
      <Button 
        onClick={onClick}
        disabled={isLastQuestion ? isSubmitting : disabled}
        className={`${isLastQuestion ? 'bg-green-600 hover:bg-green-700' : 'bg-primary hover:bg-primary/90'} text-white px-8 py-6 rounded-full transform transition-all duration-200 hover:scale-105 flex items-center gap-2 text-lg ${!isLastQuestion && 'disabled:opacity-50 disabled:cursor-not-allowed'}`}
      >
        {isLastQuestion ? (isSubmitting ? "Submitting..." : "Submit All Answers") : "Next Question"}
        {isLastQuestion ? <CheckCircle size={20} /> : <ChevronRight size={20} />}
      </Button>
    </div>
  )
} 