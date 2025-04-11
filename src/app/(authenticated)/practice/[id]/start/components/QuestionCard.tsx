import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info } from "lucide-react"

interface QuestionCardProps {
  question: any
  index: number
  isCurrentQuestion: boolean
  answer?: string
  hints?: string[]
  children?: React.ReactNode
}

export const QuestionCard = ({ question, index, isCurrentQuestion, answer, hints, children }: QuestionCardProps) => {
  return (
    <div key={index} className={isCurrentQuestion ? 'card-active' : 'card'}>
      <div className="card-content">
        <div className="header flex items-center gap-2">
          <h3 className="title">{question.question}</h3>
          {hints && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-500" />
              </TooltipTrigger>
              <TooltipContent className="space-y-1">
                {hints.map((hint, i) => (
                  <li key={i} className="text-sm list-[lower-roman] ml-4">{hint}</li>
                ))}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        {children}
      </div>
      {answer && !isCurrentQuestion && (
        <div className="flex items-center gap-4 mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 italic dark:border-green-800">
          <p className="text-gray-700 dark:text-gray-200">{answer}</p>
        </div>
      )}
    </div>
  )
}