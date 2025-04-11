interface QuestionCardProps {
  question: any
  index: number
  isCurrentQuestion: boolean
  answer?: string
  children?: React.ReactNode
}

export const QuestionCard = ({ question, index, isCurrentQuestion, answer, children }: QuestionCardProps) => {
  return (
    <div className={isCurrentQuestion ? 'card-active' : 'card'}>
      <div className="card-content">
        <div className="header">
          <h3 className="title">{question.question}</h3>
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